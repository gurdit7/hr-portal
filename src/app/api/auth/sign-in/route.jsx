import { NextResponse } from "next/server";
import connect from "../../../libs/mongo/index";
import Users from "../../../../model/userModel";
import Roles from "../../../../model/addRole";
import userData from '../../../../model/userData'
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const POST = async (request) => {
  try {
    await connect();
    const user = await Users.find();
    const payload = await request.json();
    const data = await Users.findOne({ email: payload?.email })
      .then(async (userExist) => {
        if (userExist) {
          const password = await bcrypt.compare(
            payload?.password,
            userExist?.password
          );
          if (password) {
            const user = {
              email: userExist?.email,
              password: userExist?.password,
            };
            const session = await encrypt({ user });
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            cookies().set("session", session, {
              httpOnly: true,
              expires: expiresAt,
            });
          const dataPermissions =  await userData?.findOne({ userID: userExist?.userID })
              .then(async (userExist) => {
                if (userExist) {
                  const permission = await Roles.findOne({
                    role: userExist?.role,
                  });
                  return {
                    user: userExist,
                    permissions: permission?.permissions,
                    status:200
                  };
                } else {
                  return { error: "User Not Found", status: 404 };
                }
              })
              .then((res) => {
                return res;
              });
              return dataPermissions;
          } else {
            return { error: "Password not Match", status: 403 };
          }
        } else {
          return { error: "User Not Found", status: 404 };
        }
      })
      .then((res) => {
        return res;
      });
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log("error>>", error);
    return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
  }
};
const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);
export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function GetSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  const user = await decrypt(session);
  await connect();
  const data = await Users.findOne({ email: user?.user?.email })
    .then(async (userExist) => {
      if (userExist) {
        if (user?.user?.password === userExist?.password) {
          return userExist;
        } else {
          return { error: "Password not Match" };
        }
      } else {
        return { error: "User Not Found" };
      }
    })
    .then((res) => {
      return res;
    });
  return data;
}

export async function updateSession(request) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
  });
  return res;
}

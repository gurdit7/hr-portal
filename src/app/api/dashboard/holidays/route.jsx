import { NextResponse } from "next/server";
import connect from "@/app/libs/mongo";
import Holidays from "@/model/holidays";
import Roles from "@/model/addRole";
import userData from "@/model/userData";

export const POST = async (request) => {
    try { 
      await connect();
      const payload = await request.json();
      const holiday = new Holidays({
        date: payload?.date,
        festival: payload?.festival,
        day: payload?.day,
        year: payload?.year
      });            
      const result = await holiday.save();
      return new NextResponse(JSON.stringify(result), { status: 200 });
    } catch (error) {      
      return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
    }
  };
  
  export const GET = async (request) => {
    try { 
      await connect();
      const date = new Date();
      const year = date.getFullYear();
      const holiday = await Holidays.find({year});      
      return new NextResponse(JSON.stringify(holiday), { status: 200 });
    } catch (error) {      
      return new NextResponse("ERROR" + JSON.stringify(error), { status: 500 });
    }
  };

  export const DELETE = async (request) => {
    try {
      await connect();
      const payload = await request.json();
      if (payload?.key) {   
        const user = await userData.findOne({ _id: payload?.key, status: "active" });        
        const data = await Roles.find({
          role: user?.role,
          permissions: "write-holidays",
        });
        if (data && data.length > 0) { 
          const departments = await Holidays.deleteOne({ _id: payload?.name });
          if (departments?.deletedCount > 0) {
            return new NextResponse(
              JSON.stringify({ status: 200, deleted: true }),
              {
                status: 200,
              }
            );
          }
        } else {
          return new NextResponse(
            JSON.stringify({ error: "You Don't have permissions." }),
            {
              status: 403,
            }
          );
        }
      } else {
        return new NextResponse(
          JSON.stringify({ error: "Please add API key." }),
          {
            status: 401,
          }
        );
      }
    } catch (error) {
      if (error?.path === "_id") {
        return new NextResponse(JSON.stringify({ error: "Invalid api key." }), {
          status: 401,
        });
      } else {
        return new NextResponse(
          "ERROR" +
            JSON.stringify({
              error: "Please add required fields.",
              errors: JSON.stringify(error),
            }),
          { status: 500 }
        );
      }
    }
  };
  
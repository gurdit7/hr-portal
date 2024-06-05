import { NextResponse } from "next/server";
import connect from "@/app/libs/mongo";
import Holidays from "@/model/holidays";

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
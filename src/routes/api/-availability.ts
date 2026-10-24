import {
 createFileRoute
}
from "@tanstack/react-router";


import {
 findCrmServiceId,
 getCrmAvailability
}
from "@/lib/crm/crm-api.server";



export const Route =
createFileRoute("/api/availability")({

 server:{

 handlers:{


 GET:async({request})=>{


 try{


 const url =
 new URL(request.url);



 const service =
 url.searchParams.get(
  "service_id"
 );


 const date =
 url.searchParams.get(
  "date"
 );



 if(!service || !date){

 return Response.json(
  {
   error:"missing params"
  },
  {
   status:400
  }
 );

 }



 const crmServiceId =
 await findCrmServiceId(
   service
 );



 if(!crmServiceId){

 return Response.json(
 {
  items:[]
 }
 );

 }



 const availability =
 await getCrmAvailability(
   crmServiceId,
   date
 );



 return Response.json(
 availability
 );


 }
 catch(error){


 console.error(
  "API AVAILABILITY ERROR",
  error
 );


 return Response.json(
 {
  items:[]
 },
 {
  status:500
 }
 );


 }



 }


 }

 }

});
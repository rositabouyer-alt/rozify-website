const CRM_API_URL = process.env.CRM_API_URL;

async function crmFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  if (!CRM_API_URL) {
    throw new Error("CRM_API_URL missing");
  }

  const response = await fetch(
    `${CRM_API_URL}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `CRM ERROR ${response.status}: ${text}`
    );
  }

  return response.json();
}



export async function findCrmServiceId(
  websiteServiceId: string
) {

  const result =
    await crmFetch<{ items: any[] }>("/api/services");


  const services = result.items || [];


  const map: Record<string, string[]> = {

    hair_color: [
      "رنگ",
      "hair color",
      "hair",
      "color"
    ],

    highlights: [
      "هایلایت",
      "highlight",
      "highlights"
    ],

    balayage: [
      "بالیاژ",
      "balayage"
    ],

    haircut: [
      "کوتاهی",
      "haircut",
      "cut"
    ],

    keratin: [
      "کراتین",
      "keratin"
    ],

    makeup: [
      "میکاپ",
      "makeup"
    ],

    lashes: [
      "مژه",
      "lash",
      "lashes"
    ],

    nails: [
      "ناخن",
      "nail",
      "nails",
      "manicure"
    ],

    facial: [
      "فیشیال",
      "facial"
    ]

  };


  const keys =
    map[websiteServiceId] ||
    [
      websiteServiceId
        .replace("_", " ")
        .toLowerCase()
    ];



  const service = services.find((s)=>{

    const text =
      `${s.name || ""} ${s.name_fa || ""} ${s.name_en || ""}`
        .toLowerCase();


    return keys.some((k)=>
      text.includes(
        k.toLowerCase()
      )
    );

  });



  console.log(
    "CRM SERVICE MATCH:",
    {
      websiteServiceId,
      keys,
      service
    }
  );


  return service?.id || null;

}





export async function findOrCreateCrmCustomer(
  data:any
){

  return crmFetch(
    "/api/customers",
    {
      method:"POST",

      body:JSON.stringify({

        name:data.customer_name,

        phone:data.phone,

        notes:data.notes || ""

      })

    }

  );

}





export async function createCrmBooking(
  data:any
){

  return crmFetch(
    "/api/bookings",
    {

      method:"POST",

      body:JSON.stringify({

        customer_id:data.customer_id,

        service_id:data.service_id,

        date:data.date,

        time:data.time,

        notes:data.notes || ""

      })

    }

  );

}





export async function getCrmAvailability(
  serviceId:number,
  date:string
){

  console.log(
    "GET AVAILABILITY",
    {
      serviceId,
      date
    }
  );


  try {


    const result =
      await crmFetch<{
        items:any[]
      }>(
        `/api/bookings/availability?service_id=${serviceId}&date=${date}`
      );



    console.log(
      "CRM AVAILABILITY RESULT:",
      JSON.stringify(
        result,
        null,
        2
      )
    );



    return result;



  } catch(error){


    console.error(
      "AVAILABILITY ERROR",
      error
    );



    return {
      items:[]
    };


  }

}
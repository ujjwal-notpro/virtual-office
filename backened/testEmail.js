require("dotenv").config();

const{Resend}=require("resend");

const resend=new Resend(process.env.RESEND_API_KEY);

async function sendTestEmail(){
    const {data,error}=await resend.emails.send({
        from:"onboarding@resend.dev",
        to:"ayushgupta2170@gmail.com",
        subject:"Flowbit Resend Test",
        html: "<h2>Flowbit email test successful!</h2>"
    });

    if(error){
        console.log("Email failed:",error);
        return;
    }

    console.log("Email sent successfully:",data);
}

sendTestEmail();
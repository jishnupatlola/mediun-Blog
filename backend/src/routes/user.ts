import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import {Signininput,Signupinput,Createblog,Updateblog} from "jishnu-mediumvalid";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
}>();
userRouter.use("/*",async(c,next)=>{
    await next();
})


userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = Signupinput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ error: "invalid input" });
    }
    try{
        const body = await c.req.json();
        const existinguser=await prisma.user.findUnique({
            where:{
                username : body.username
            }
        });
        if(existinguser){
            c.status(400)
            return c.text("username already taken")
        }else{
            const user = await prisma.user.create({
                data: {
                    username: body.username,
                    password: body.password
                }
            });
            const token = await sign({ id: Number(user.id) }, c.env.JWT_SECRET)
            return c.json({
            jwt: token
            })
        };
    }catch(e){
        console.log("jwt:",c.env.JWT_SECRET)
        console.log(e)
        c.status(400)
        return c.text("there is an error while sign up")
    }
})
  
userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
      }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = Signininput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ error: "invalid input" });
    }
    try{
        const body = await c.req.json();
        const user = await prisma.user.findUnique({
            where: {
                username: body.username,
                password: body.password
            }
        });

        if (!user) {
            c.status(400);
            return c.json({ error: "user not found in database" });
        }

        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ jwt });
    }catch(e){
        console.log(e)
        c.status(400)
        return c.text("there is an error in sign in")
    }
})

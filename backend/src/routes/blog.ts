import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify,decode, sign } from "hono/jwt";
import {Createblog,Updateblog,Signininput,Signupinput} from "jishnu-mediumvalid"

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }
    Variables:{
        userid:string;
        authorname:string;
    }
}>();

blogRouter.use("/*",async (c,next)=>{
    const authHeader=c.req.header("Authorization")||"";
    try{
        const user=await verify(authHeader,c.env.JWT_SECRET)
        if(user){
            c.set("userid",String(user.id))
            await next();
        }else{
            c.status(400)
            c.text("JWt header is not verified")
        }
    }catch(e){
        c.status(400)
        return c.text("you have error in JWT auth")
    }  
});

blogRouter.post('/', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL	,
	}).$extends(withAccelerate());
    const body = await c.req.json();
	const { success } = Createblog.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
    try{
        const id=c.get("userid");
        const body = await c.req.json();
        const blog=await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorID: Number(id),
            }
        });
        return c.json({
            id: blog.id
        });
    }catch(e){
        console.log(e)
        c.status(400)
        return c.text("u have an error in posting blog")
    }
})

blogRouter.put("/",async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
    const body = await c.req.json();
	const { success } = Updateblog.safeParse(body);
	if (!success) {
		c.status(400);
		return c.json({ error: "invalid input" });
	}
    try{
        const body = await c.req.json();
        const blog = await prisma.blog.update({
            where:{
                id:body.id
            },
            data:{
                title:body.title,
                content:body.content
            }
        });
        c.status(200)
        return c.text("updated succesfully")
    }catch(e){
        console.log(e)
        c.status(400)
        return c.text("there is an error in updation")
    }
})

blogRouter.get('/bulk',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
    try{
        const blogs=await prisma.blog.findMany()
        return c.json({blogs})
    }catch(e){
        c.status(400)
        return c.text("error in getting all the blogs")
    }
})
blogRouter.get("/:id",async(c)=>{
    const blogid=c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
    try{
        const post=await prisma.blog.findFirst({
            where:{
                id:Number(blogid)
            }
        })
        return c.json({post})
    }catch(e){
        console.log(e)
        c.status(400)
        return c.text("there is an error while getting your blog")
    }
})
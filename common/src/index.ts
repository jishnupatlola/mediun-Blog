import z from "zod";

export const Signupinput=z.object({
    username: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional()
})


export const Signininput=z.object({
    username: z.string().email(),
    password: z.string().min(8)
})



export const Createblog=z.object({
    title: z.string(),
    content: z.string()
})



export const Updateblog=z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
})

export type Updateblog=z.infer<typeof Updateblog>
export type Signupinput=z.infer<typeof Signupinput>
export type Createblog=z.infer<typeof Createblog>
export type Signininput=z.infer<typeof Signininput>
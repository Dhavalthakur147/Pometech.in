import { z } from "zod";

const uuidParam = z.object({ params: z.object({ id: z.string().uuid() }) });
const optionalText = z.string().trim().optional().nullable();

export const serviceSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string().min(2),
    icon: optionalText,
    image: optionalText,
    price: z.coerce.number().nonnegative().optional().nullable()
  })
});

export const portfolioSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    category: z.string().min(2),
    image: optionalText,
    description: optionalText
  })
});

export const demoWorkSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    category: z.string().min(2),
    image: optionalText,
    link: optionalText,
    description: optionalText
  })
});

export const clientSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    business_name: optionalText,
    phone: optionalText,
    email: z.string().email().optional().nullable(),
    service: optionalText,
    status: z.enum(["lead", "active", "inactive", "completed"]).optional()
  })
});

export const orderSchema = z.object({
  body: z.object({
    client_id: z.string().uuid(),
    service: z.string().min(2),
    amount: z.coerce.number().nonnegative(),
    payment_status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
    order_status: z.enum(["new", "pending", "completed", "cancelled"]).optional(),
    delivery_date: z.string().optional().nullable()
  })
});

export const orderStatusSchema = z.object({
  body: z.object({
    payment_status: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
    order_status: z.enum(["new", "pending", "completed", "cancelled"]).optional()
  })
});

export const messageSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email().optional().nullable(),
    phone: optionalText,
    message: z.string().min(5)
  })
});

export const replySchema = z.object({
  body: z.object({
    subject: z.string().min(2).default("Reply from Pomegranate Technology"),
    reply: z.string().min(2)
  })
});

export const paymentSchema = z.object({
  body: z.object({
    client_id: z.string().uuid(),
    amount: z.coerce.number().nonnegative(),
    payment_method: z.string().min(2),
    transaction_id: optionalText,
    payment_status: z.enum(["pending", "paid", "failed", "refunded"]).optional()
  })
});

export const adminUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8).optional(),
    role: z.enum(["super_admin", "admin", "editor"]).default("admin")
  })
});

export const siteContentSchema = z.object({
  body: z.object({
    key: z.string().min(2).max(120).regex(/^[a-z0-9_.-]+$/i),
    value: z.string().min(1),
    label: optionalText,
    type: z.enum(["text", "textarea", "url", "image"]).default("text")
  })
});

export const idSchema = uuidParam;

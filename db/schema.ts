import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// DRIZZLE ENUMS
// ==========================================

export const userRoleEnum = pgEnum("user_role", ["admin", "commercial", "client"]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const claimStatusEnum = pgEnum("claim_status", [
  "pending",
  "in_review",
  "approved",
  "rejected",
  "resolved",
]);

export const claimPriorityEnum = pgEnum("claim_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const invoiceTypeEnum = pgEnum("invoice_type", ["sale", "purchase"]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "unpaid",
  "paid",
  "cancelled",
  "overdue",
]);

export const deliveryStatusEnum = pgEnum("delivery_status", [
  "pending",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed",
]);

export const stockMovementTypeEnum = pgEnum("stock_movement_type", [
  "in",
  "out",
  "adjustment",
  "return",
  "transfer",
]);

export const returnStatusEnum = pgEnum("return_status", [
  "requested",
  "approved",
  "received",
  "inspected",
  "refunded",
  "rejected",
]);

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed_amount",
]);

// ==========================================
// DRIZZLE TABLES
// ==========================================

// 1. Users (Synchronized with Clerk)
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    phone: varchar("phone", { length: 50 }),
    role: userRoleEnum("role").default("client").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_users_clerk_user_id").on(table.clerkUserId),
    index("idx_users_email").on(table.email),
    index("idx_users_role").on(table.role),
  ]
);

// 2. Product Categories
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    parentId: uuid("parent_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_categories_slug").on(table.slug),
    index("idx_categories_parent_id").on(table.parentId),
  ]
);

// 3. Products
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    costPrice: numeric("cost_price", { precision: 12, scale: 2 }),
    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    subCategoryId: uuid("sub_category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    supplierId: uuid("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }),
    vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).default("20.00").notNull(),
    weight: numeric("weight", { precision: 10, scale: 2 }),
    dimensions: jsonb("dimensions"),
    qrCodeUrl: text("qr_code_url"),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").default(true).notNull(),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_products_slug").on(table.slug),
    index("idx_products_sku").on(table.sku),
    index("idx_products_category_id").on(table.categoryId),
    index("idx_products_is_active").on(table.isActive),
    index("idx_products_deleted_at").on(table.deletedAt),
  ]
);

// 4. Product Variants
export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    attributes: jsonb("attributes"),
    price: numeric("price", { precision: 12, scale: 2 }),
    costPrice: numeric("cost_price", { precision: 12, scale: 2 }),
    barcode: varchar("barcode", { length: 255 }),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_product_variants_product_id").on(table.productId),
    index("idx_product_variants_sku").on(table.sku),
    index("idx_product_variants_barcode").on(table.barcode),
    index("idx_product_variants_deleted_at").on(table.deletedAt),
  ]
);

// 4b. Product Images
export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    key: text("key"),
    isPrimary: boolean("is_primary").default(false).notNull(),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_product_images_product_id").on(table.productId),
    index("idx_product_images_is_primary").on(table.isPrimary),
  ]
);

// 5. Stocks
export const stocks = pgTable(
  "stocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id")
      .notNull()
      .unique()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    quantity: integer("quantity").default(0).notNull(),
    minThreshold: integer("min_threshold").default(5).notNull(),
    warehouseLocation: varchar("warehouse_location", { length: 100 }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_stocks_variant_id").on(table.variantId)]
);

// 6. Stock Movements
export const stockMovements = pgTable(
  "stock_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    type: stockMovementTypeEnum("type").notNull(),
    quantity: integer("quantity").notNull(),
    previousQuantity: integer("previous_quantity").notNull(),
    newQuantity: integer("new_quantity").notNull(),
    reason: varchar("reason", { length: 255 }),
    performedByUserId: uuid("performed_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_stock_movements_variant_id").on(table.variantId),
    index("idx_stock_movements_type").on(table.type),
    index("idx_stock_movements_performed_by").on(table.performedByUserId),
  ]
);

// 7. Suppliers
export const suppliers = pgTable(
  "suppliers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 100 }).notNull().unique(),
    taxId: varchar("tax_id", { length: 100 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_suppliers_code").on(table.code),
    index("idx_suppliers_name").on(table.name),
  ]
);

// 8. Supplier Contacts
export const supplierContacts = pgTable(
  "supplier_contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    supplierId: uuid("supplier_id")
      .notNull()
      .references(() => suppliers.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    role: varchar("role", { length: 100 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_supplier_contacts_supplier_id").on(table.supplierId)]
);

// 9. Carriers / Transporteurs
export const carriers = pgTable(
  "carriers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 100 }).notNull().unique(),
    contactEmail: varchar("contact_email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    trackingUrlTemplate: text("tracking_url_template"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_carriers_code").on(table.code),
    index("idx_carriers_is_active").on(table.isActive),
  ]
);

// 10. Orders
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: varchar("order_number", { length: 100 }).notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: orderStatusEnum("status").default("pending").notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    shippingFee: numeric("shipping_fee", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    discountAmount: numeric("discount_amount", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    carrierId: uuid("carrier_id").references(() => carriers.id, {
      onDelete: "set null",
    }),
    trackingNumber: varchar("tracking_number", { length: 255 }),
    deliveryStatus: deliveryStatusEnum("delivery_status").default("pending"),
    shippingAddress: jsonb("shipping_address"),
    billingAddress: jsonb("billing_address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_orders_order_number").on(table.orderNumber),
    index("idx_orders_user_id").on(table.userId),
    index("idx_orders_status").on(table.status),
    index("idx_orders_carrier_id").on(table.carrierId),
  ]
);

// 11. Order Items
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "restrict" }),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [
    index("idx_order_items_order_id").on(table.orderId),
    index("idx_order_items_variant_id").on(table.variantId),
  ]
);

// 12. Returns
export const returns = pgTable(
  "returns",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    returnNumber: varchar("return_number", { length: 100 }).notNull().unique(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: returnStatusEnum("status").default("requested").notNull(),
    reason: text("reason"),
    refundAmount: numeric("refund_amount", { precision: 12, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_returns_return_number").on(table.returnNumber),
    index("idx_returns_order_id").on(table.orderId),
    index("idx_returns_user_id").on(table.userId),
    index("idx_returns_status").on(table.status),
  ]
);

// 13. Claims / Réclamations
export const claims = pgTable(
  "claims",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    claimNumber: varchar("claim_number", { length: 100 }).notNull().unique(),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subject: varchar("subject", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: claimStatusEnum("status").default("pending").notNull(),
    priority: claimPriorityEnum("priority").default("medium").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_claims_claim_number").on(table.claimNumber),
    index("idx_claims_order_id").on(table.orderId),
    index("idx_claims_user_id").on(table.userId),
    index("idx_claims_status").on(table.status),
  ]
);

// 14. Invoices (Factures Ventes / Achats)
export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invoiceNumber: varchar("invoice_number", { length: 100 }).notNull().unique(),
    type: invoiceTypeEnum("type").notNull(),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    supplierId: uuid("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    status: invoiceStatusEnum("status").default("draft").notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    dueDate: timestamp("due_date"),
    paidAt: timestamp("paid_at"),
    pdfUrl: text("pdf_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_invoices_invoice_number").on(table.invoiceNumber),
    index("idx_invoices_order_id").on(table.orderId),
    index("idx_invoices_supplier_id").on(table.supplierId),
    index("idx_invoices_user_id").on(table.userId),
    index("idx_invoices_type").on(table.type),
    index("idx_invoices_status").on(table.status),
  ]
);

// 15. Promo Codes & Marketing
export const promoCodes = pgTable(
  "promo_codes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 100 }).notNull().unique(),
    discountType: discountTypeEnum("discount_type").notNull(),
    discountValue: numeric("discount_value", {
      precision: 12,
      scale: 2,
    }).notNull(),
    minOrderAmount: numeric("min_order_amount", { precision: 12, scale: 2 }),
    maxUses: integer("max_uses"),
    usesCount: integer("uses_count").default(0).notNull(),
    expiresAt: timestamp("expires_at"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_promo_codes_code").on(table.code),
    index("idx_promo_codes_is_active").on(table.isActive),
  ]
);

// 16. Notifications
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    link: text("link"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_notifications_user_id").on(table.userId),
    index("idx_notifications_is_read").on(table.isRead),
  ]
);

// 17. Audit Logs
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 100 }).notNull(),
    entity: varchar("entity", { length: 100 }).notNull(),
    entityId: varchar("entity_id", { length: 255 }),
    details: jsonb("details"),
    ipAddress: varchar("ip_address", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_audit_logs_user_id").on(table.userId),
    index("idx_audit_logs_action").on(table.action),
    index("idx_audit_logs_entity").on(table.entity),
  ]
);

// ==========================================
// DRIZZLE RELATIONS
// ==========================================

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  returns: many(returns),
  claims: many(claims),
  invoices: many(invoices),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  stockMovements: many(stockMovements),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "categoryToParent",
  }),
  children: many(categories, { relationName: "categoryToParent" }),
  products: many(products, { relationName: "productCategory" }),
  subProducts: many(products, { relationName: "productSubCategory" }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
    relationName: "productCategory",
  }),
  subCategory: one(categories, {
    fields: [products.subCategoryId],
    references: [categories.id],
    relationName: "productSubCategory",
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    stock: one(stocks, {
      fields: [productVariants.id],
      references: [stocks.variantId],
    }),
    movements: many(stockMovements),
    orderItems: many(orderItems),
  })
);

export const stocksRelations = relations(stocks, ({ one }) => ({
  variant: one(productVariants, {
    fields: [stocks.variantId],
    references: [productVariants.id],
  }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  variant: one(productVariants, {
    fields: [stockMovements.variantId],
    references: [productVariants.id],
  }),
  performedBy: one(users, {
    fields: [stockMovements.performedByUserId],
    references: [users.id],
  }),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  contacts: many(supplierContacts),
  invoices: many(invoices),
}));

export const supplierContactsRelations = relations(
  supplierContacts,
  ({ one }) => ({
    supplier: one(suppliers, {
      fields: [supplierContacts.supplierId],
      references: [suppliers.id],
    }),
  })
);

export const carriersRelations = relations(carriers, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  carrier: one(carriers, {
    fields: [orders.carrierId],
    references: [carriers.id],
  }),
  items: many(orderItems),
  returns: many(returns),
  claims: many(claims),
  invoices: many(invoices),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const returnsRelations = relations(returns, ({ one }) => ({
  order: one(orders, {
    fields: [returns.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [returns.userId],
    references: [users.id],
  }),
}));

export const claimsRelations = relations(claims, ({ one }) => ({
  order: one(orders, {
    fields: [claims.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [claims.userId],
    references: [users.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),
  supplier: one(suppliers, {
    fields: [invoices.supplierId],
    references: [suppliers.id],
  }),
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Infer types export
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;

export type Stock = typeof stocks.$inferSelect;
export type StockMovement = typeof stockMovements.$inferSelect;

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;

export type Return = typeof returns.$inferSelect;
export type Claim = typeof claims.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type Carrier = typeof carriers.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

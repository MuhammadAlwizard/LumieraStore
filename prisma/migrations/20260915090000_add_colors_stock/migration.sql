PRAGMA foreign_keys=OFF;

CREATE TABLE "Color" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "hex" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");
INSERT INTO "Color" ("id", "name", "hex") VALUES
  ('color-burgundy', 'Burgundy', '#8B3A3A'),
  ('color-oatmeal', 'Oatmeal', '#F5E6D3'),
  ('color-stone-grey', 'Stone Grey', '#9B9C9E'),
  ('color-hydra-sage', 'Hydra Sage', '#7A9B8E');

ALTER TABLE "Product" RENAME TO "Product_old";
CREATE TABLE "Product" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "colorId" TEXT NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "imagePath" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Product_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "Product" ("id", "name", "slug", "price", "description", "colorId", "stock", "imagePath", "createdAt", "updatedAt")
SELECT "id", "name", "slug", "price", "description",
  CASE "color" WHEN 'Burgundy' THEN 'color-burgundy' WHEN 'Oatmeal' THEN 'color-oatmeal' WHEN 'Stone Grey' THEN 'color-stone-grey' WHEN 'Hydra Sage' THEN 'color-hydra-sage' ELSE 'color-burgundy' END,
  0, "imagePath", "createdAt", "updatedAt"
FROM "Product_old";
DROP TABLE "Product_old";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

CREATE TABLE "StockMovement" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "note" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

PRAGMA foreign_keys=ON;

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const productCategories = await prisma.productCategory.createMany({
    data: [
      { name: 'Lanche', description: 'Os nossos deliciosos lanches para matar sua fome!' },
      { name: 'Acompanhamento', description: 'Incríveis acompanhamentos que não podem faltar!' },
      { name: 'Bebida', description: 'Refrescantes bebidas para matar sua sede!' },
      { name: 'Sobremesa', description: 'Saborosas sobremesas para matar sua vontade!' },
    ],
  })

  console.log('Categorias de produtos criadas:', productCategories)

  const products = await prisma.product.createMany({
    data: [
      { name: 'X-Tudo', description: 'O clássico completo!', price: 34.99, categoryId: 1 },
      { name: 'X-Burger', description: 'O clássico essencial!', price: 22.99, categoryId: 1 },
      { name: 'X-Salada', description: 'O clássico saudável!', price: 24.99, categoryId: 1 },
      { name: 'Batata frita', description: 'Todo mundo gosta!', price: 12.99, categoryId: 2 },
      { name: 'Onion rings', description: 'Cebolas gourmet!', price: 10.99, categoryId: 2 },
      { name: 'Coca-Cola', description: 'Refrigerante clássico!', price: 7.99, categoryId: 3 },
      { name: 'Fanta Laranja', description: 'Refrigerante mais divertido!', price: 7.99, categoryId: 3 },
      { name: 'Milkshake', description: 'Delicioso milkshake!', price: 14.99, categoryId: 4 },
    ],
  })

  console.log('Produtos criados:', products)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { connect, disconnect } from 'mongoose';
import Product from '../../models/Product';
import { dbConnection } from '..';
export const execProductSeeds = () => {
  const productSeeds = [
    {
      name: {
        vi: 'Bánh mì Hà Nội',
        en: "Hanoi's bread",
      },
      description: {
        vi: 'Bánh mì là một món ăn Việt Nam, với lớp vỏ ngoài là một ổ bánh mì nướng có da giòn, ruột mềm, còn bên trong là phần nhân.',
        en: 'Banh mi is a Vietnamese dish, with the outer layer of a loaf of toasted bread with crispy skin, soft intestine, and a filling inside.',
      },
      price: 30000,
      stocks: 1000000,
      category: '643feffd4659d65814c8802d',
      featuredImages: [
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681918206/products/ks31rjjkm7wxjqoppig0.jpg',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681918205/products/oipiq42i5eufwmiwykbo.jpg',
      ],
    },
    {
      name: {
        vi: 'Bánh tráng trộn',
        en: 'Mixed paperrice',
      },
      description: {
        vi: 'Bánh mì là một món ăn Việt Nam, với lớp vỏ ngoài là một ổ bánh mì nướng có da giòn, ruột mềm, còn bên trong là phần nhân.',
        en: 'Banh mi is a Vietnamese dish, with the outer layer of a loaf of toasted bread with crispy skin, soft intestine, and a filling inside.',
      },
      price: 40000,
      stocks: 1000000,
      category: '64400b786deda54045e7e8e8',
      featuredImages: [
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681919256/products/fy8qv7tmi84pubsqkd2n.jpg',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681919256/products/pzt9uolxedmmvcqjtums.jpg',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681919256/products/noxb2twbcwlqbnigzsao.jpg',
      ],
    },
    {
      name: {
        vi: 'Bánh tráng cuốn',
        en: 'Mixed paperrice',
      },
      description: {
        vi: 'Bánh mì là một món ăn Việt Nam, với lớp vỏ ngoài là một ổ bánh mì nướng có da giòn, ruột mềm, còn bên trong là phần nhân.',
        en: 'Banh mi is a Vietnamese dish, with the outer layer of a loaf of toasted bread with crispy skin, soft intestine, and a filling inside.',
      },
      price: 50000,
      stocks: 1000000,
      category: '64400b786deda54045e7e8e8',
      featuredImages: [
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681919074/products/wda7ytvn0rfmqtwuhj5v.jpg',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681919075/products/kuofd5rlpx61u7dujt5e.jpg',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681919079/products/rnu7w28x25qrk5xazcvq.jpg',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681919155/products/ivr1uhpczhvoggs0neep.jpg',
      ],
    },
    {
      name: {
        vi: 'Burger bò',
        en: 'Beefburger',
      },
      description: {
        vi: 'Bánh mì là một món ăn Việt Nam, với lớp vỏ ngoài là một ổ bánh mì nướng có da giòn, ruột mềm, còn bên trong là phần nhân.',
        en: 'Banh mi is a Vietnamese dish, with the outer layer of a loaf of toasted bread with crispy skin, soft intestine, and a filling inside.',
      },
      price: 70000,
      stocks: 1000000,
      category: '644015a1683d6780bbf7a7f3',
      featuredImages: [
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681921535/products/dyhfyxjbflpupwcrlrvj.png',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681921535/products/np5tlqylftfffgc56cbe.png',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681921535/products/ffeh4marld3gmkd0rz2g.png',
      ],
    },
    {
      name: {
        vi: 'Pizza gà',
        en: 'Chickenpizza',
      },
      description: {
        vi: 'Bánh mì là một món ăn Việt Nam, với lớp vỏ ngoài là một ổ bánh mì nướng có da giòn, ruột mềm, còn bên trong là phần nhân.',
        en: 'Banh mi is a Vietnamese dish, with the outer layer of a loaf of toasted bread with crispy skin, soft intestine, and a filling inside.',
      },
      price: 150000,
      stocks: 1000000,
      category: '644015a9683d6780bbf7a7f7',
      featuredImages: [
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681921591/products/slhpzhbeef6csfj29ihb.png',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1681921592/products/t0gtrkzfeasqlqnaj141.png',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1682096306/products/ycj8izjhlb1uwilxotzq.png',
      ],
    },
    {
      name: {
        vi: 'Mì trộn hải sản',
        en: 'Seafood noodles',
      },
      description: {
        vi: 'Bánh mì là một món ăn Việt Nam, với lớp vỏ ngoài là một ổ bánh mì nướng có da giòn, ruột mềm, còn bên trong là phần nhân.',
        en: 'Banh mi is a Vietnamese dish, with the outer layer of a loaf of toasted bread with crispy skin, soft intestine, and a filling inside.',
      },
      price: 100000,
      stocks: 1000000,
      category: '6443d77f150fe45f5a8abf72',
      featuredImages: [
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1682167876/products/mitronhaisan_j3vcdz.webp',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1682167876/products/mi-tron-tom-muc_e5trkz.png',
        'https://res.cloudinary.com/dxd7ws9nz/image/upload/v1682167875/products/mi-xao-hai-san_jpmcgy.jpg',
      ],
    },
  ];
  return Product.insertMany(productSeeds);
};

connect(dbConnection.url, dbConnection.options as any, async () => {
  await execProductSeeds();
  disconnect();
});

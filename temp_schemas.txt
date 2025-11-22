import * as Yup from 'yup';

export const clientSchema = Yup.object().shape({
  name: Yup.string('Nome é obrigatório').required('Nome é obrigatório'),
  phone: Yup.string().required('Telefone é obrigatório'),
  email: Yup.string().email('E-mail inválido').nullable(),
  address: Yup.string().nullable(),
});

export const productSchema = Yup.object().shape({
  name: Yup.string('Nome é obrigatório').required('Nome é obrigatório'),
  description: Yup.string().nullable(),
  price: Yup.number().typeError('Preço inválido').positive('Preço deve ser maior que zero').required('Preço é obrigatório'),
});

export const orderSchema = Yup.object().shape({
  client: Yup.object().required('Cliente não selecionado'),
  date: Yup.string().required('Data obrigatória'),
  products: Yup.array().of(
    Yup.object().shape({
      productId: Yup.string().required(),
      quantity: Yup.number().moreThan(0, 'Quantidade inválida').required(),
      unitPrice: Yup.number().required(),
    })
  ).min(1, 'Selecione ao menos um produto'),
});

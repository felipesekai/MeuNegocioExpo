type protuct = {
    key: string,
    name: string,
    price: number,
    quantity: number
}

type client = {
    id: string,
    name: string,
    phone: string
};

type user = {
    id: string,
    name: string,
    email: string
};

type order = {
    id: string,
    clientId: string,
    clientName: string,
    date: string,
    total: number,
    products: []
};


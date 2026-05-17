export interface MenuItem {
  id: string
  name: string
  price: string
  desc: string
  img: string
}

export interface CartItem extends MenuItem {
  qty: number
}

import { useContextElement } from "@/context/Context";

export default function CartLength() {
  const { cartProducts } = useContextElement();
  console.log("cartproducts .[[[[[[[[]]]]]]]]]",cartProducts)
  return <>{cartProducts.length}</>;
}

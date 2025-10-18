import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Романтика",
    price: 2500,
    image: "https://cdn.poehali.dev/projects/dc437e53-7892-4daf-ae6c-bc0d138d7a16/files/0bff628b-7251-4da8-81c6-a8c4830c086c.jpg",
    description: "Нежный букет из розовых роз"
  },
  {
    id: 2,
    name: "Весенний",
    price: 1800,
    image: "https://cdn.poehali.dev/projects/dc437e53-7892-4daf-ae6c-bc0d138d7a16/files/f9df4777-d0d4-4494-9b88-0ba4cb822cbd.jpg",
    description: "Яркие тюльпаны для настроения"
  },
  {
    id: 3,
    name: "Премиум",
    price: 3200,
    image: "https://cdn.poehali.dev/projects/dc437e53-7892-4daf-ae6c-bc0d138d7a16/files/254db09a-3146-4b6c-8816-797300f5732d.jpg",
    description: "Микс из подсолнухов и роз"
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const { toast } = useToast();

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Добавлено в корзину",
      description: product.name
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Flower2" className="text-primary" size={28} />
            <h1 className="text-2xl font-bold text-primary">Флора</h1>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-2 hover:bg-pink-50 rounded-full transition"
          >
            <Icon name="ShoppingCart" size={24} className="text-primary" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {showCart && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowCart(false)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Корзина</h2>
                <button onClick={() => setShowCart(false)}>
                  <Icon name="X" size={24} />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Корзина пустая</p>
              ) : (
                <>
                  {cart.map(item => (
                    <Card key={item.id}>
                      <CardContent className="p-3 flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.price} ₽</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center"
                            >
                              <Icon name="Minus" size={14} />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center"
                            >
                              <Icon name="Plus" size={14} />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold mb-4">
                      <span>Итого:</span>
                      <span>{totalPrice} ₽</span>
                    </div>
                    <Button className="w-full" size="lg">
                      Оформить заказ
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6">
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Свежие цветы</h2>
          <p className="text-gray-600">С доставкой по городу</p>
        </section>

        <section className="space-y-4 mb-8">
          {products.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                    <Button onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="bg-pink-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">О нас</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Icon name="Sparkles" className="text-primary mt-1" size={20} />
              <div>
                <h3 className="font-semibold">Свежие цветы</h3>
                <p className="text-sm text-gray-600">Ежедневная поставка из питомников</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="Truck" className="text-primary mt-1" size={20} />
              <div>
                <h3 className="font-semibold">Быстрая доставка</h3>
                <p className="text-sm text-gray-600">Доставим за 2 часа по городу</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icon name="Heart" className="text-primary mt-1" size={20} />
              <div>
                <h3 className="font-semibold">С любовью</h3>
                <p className="text-sm text-gray-600">Собираем каждый букет с душой</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg p-6 border border-pink-100">
          <h2 className="text-2xl font-bold mb-4 text-center">Контакты</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon name="Phone" className="text-primary" size={20} />
              <a href="tel:+79991234567" className="text-gray-700">+7 (999) 123-45-67</a>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="MapPin" className="text-primary" size={20} />
              <p className="text-gray-700">г. Москва, ул. Цветочная, 15</p>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Clock" className="text-primary" size={20} />
              <p className="text-gray-700">Ежедневно с 9:00 до 21:00</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-pink-50 border-t border-pink-100 mt-8 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2024 Флора. Цветочный магазин</p>
        </div>
      </footer>
    </div>
  );
}

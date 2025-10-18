import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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
    name: 'Розы и пионы',
    price: 3500,
    image: 'https://cdn.poehali.dev/projects/dc437e53-7892-4daf-ae6c-bc0d138d7a16/files/cf7efe6e-f563-4aaa-88dc-93a6d8dcf791.jpg',
    description: 'Нежный букет из розовых роз и белых пионов'
  },
  {
    id: 2,
    name: 'Тюльпаны',
    price: 2800,
    image: 'https://cdn.poehali.dev/projects/dc437e53-7892-4daf-ae6c-bc0d138d7a16/files/71536688-8a31-4543-a8f6-15a54e9f2e90.jpg',
    description: 'Элегантные тюльпаны в персиковых тонах'
  },
  {
    id: 3,
    name: 'Полевые цветы',
    price: 2200,
    image: 'https://cdn.poehali.dev/projects/dc437e53-7892-4daf-ae6c-bc0d138d7a16/files/d8836655-5548-425b-a2a6-effd200dddcc.jpg',
    description: 'Букет из ромашек и лаванды'
  }
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-md">
          <h1 className="text-2xl font-bold text-foreground">Флора</h1>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Icon name="ShoppingBag" size={24} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col h-full">
                {cart.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Корзина пуста</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-auto space-y-4">
                      {cart.map(item => (
                        <Card key={item.id} className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{item.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.price.toLocaleString()} ₽
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Icon name="Minus" size={16} />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Icon name="Plus" size={16} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 ml-auto"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Icon name="Trash2" size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-lg font-semibold mb-4">
                        <span>Итого:</span>
                        <span>{totalPrice.toLocaleString()} ₽</span>
                      </div>
                      <Button className="w-full" size="lg">
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-md">
        <section className="mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold mb-4 text-foreground">Свежие цветы каждый день</h2>
            <p className="text-lg text-muted-foreground">
              Создаём букеты с душой и доставляем по всему городу
            </p>
          </div>
        </section>

        <section id="catalog" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Каталог</h2>
          <div className="grid gap-6">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="overflow-hidden animate-fade-in hover:shadow-lg transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-foreground">
                      {product.price.toLocaleString()} ₽
                    </span>
                    <Button onClick={() => addToCart(product)} className="gap-2">
                      <Icon name="ShoppingCart" size={18} />
                      В корзину
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="about" className="mb-12 py-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-foreground">О магазине</h2>
          <Card className="p-6">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Мы работаем с цветами более 10 лет. Каждый букет создаётся с любовью и вниманием к деталям.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Используем только свежие цветы от проверенных поставщиков. Доставка в день заказа.
            </p>
          </Card>
        </section>

        <section id="contacts" className="mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-foreground">Контакты</h2>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Icon name="MapPin" size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Адрес</p>
                  <p className="text-muted-foreground">ул. Цветочная, 15</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Phone" size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Телефон</p>
                  <p className="text-muted-foreground">+7 (999) 123-45-67</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="Clock" size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Время работы</p>
                  <p className="text-muted-foreground">Ежедневно с 9:00 до 21:00</p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="bg-muted py-8 mt-12">
        <div className="container mx-auto px-4 max-w-md text-center">
          <p className="text-muted-foreground">© 2024 Флора. Все права защищены</p>
        </div>
      </footer>
    </div>
  );
}

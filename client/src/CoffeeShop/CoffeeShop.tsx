import { useState } from "react";
import "./CoffeeShop.css";
import DrinkOrder from "./DrinkOrder";
import Star from "./star";
import Anchor from "../components/LoadingGrid/Anchor/Anchor";
import useDevice from "../hooks/useDevice";

/**
Notion Planning doc and Figma here if you are curious! Side project since I spend so much time in coffee shops :) 
https://quiet-fireman-c5b.notion.site/Practice-Design-Virtual-Coffee-Shop-b8a55929ef89459895d32a5004ca5ff2?pvs=4
 */

export enum OrderType {
  Americano = "Americano",
  Tea = "Tea",
  Cortado = "Cortado",
  EmptyDrink = "EmptyDrink",
  EmptyPlate = "EmptyPlate",
}

const OrderPrice = {
  [OrderType.Americano]: 3,
  [OrderType.Tea]: 3,
  [OrderType.Cortado]: 4,
  [OrderType.EmptyDrink]: null,
  [OrderType.EmptyPlate]: null,
};

enum OrderStatus {
  BeingMade = "BeingMade",
  Delivered = "Delivered",
  Finished = "Finished",
}

type Order = {
  id: string;
  type: OrderType;
  createdAt: Date;
  userId: string;
  status: OrderStatus;
  payment: number | null;
};

export default function CoffeeShop() {
  const [activeDrinkType, setActiveDrinkType] = useState(OrderType.EmptyPlate);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile } = useDevice();
  const numOrdersToShow = isMobile ? 3 : 5;

  const isEmpty =
    activeDrinkType === OrderType.EmptyDrink ||
    activeDrinkType === OrderType.EmptyPlate;

  function toggleMenu() {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  }

  async function createOrder(orderType: OrderType) {
    // Add Order to History
    try {
      const orderId = crypto.randomUUID();
      const newOrder = {
        id: orderId,
        type: orderType,
        createdAt: new Date(),
        userId: "userId_TO_DO",
        status: OrderStatus.BeingMade,
        payment: OrderPrice[orderType],
      };

      setOrders((prevOrders) => [...prevOrders, newOrder]);
      alert(`Woo, one ${orderType} added to the queue!`);
      toggleMenu();
      // reduce balance
    } catch (error) {
      toggleMenu();
    }
  }

  function takeOrderFromCounter(orderId: string) {
    if (!isEmpty) {
      alert(
        "Finish your current drink before pulling another one! (try tapping the drink)"
      );
      return;
    }

    const orderToDrink = orders.find((order) => order.id === orderId);
    if (!orderToDrink) return; // should not happen
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
    setActiveDrinkType(orderToDrink.type);
  }

  function finishActiveDrink() {
    if (!isEmpty) {
      setActiveDrinkType(OrderType.EmptyDrink);
    }
  }

  return (
    <>
      <div
        className="primary-content justify-center"
        style={{ padding: 20, fontStyle: "italic", textAlign: "center" }}
      >
        <span>
          Try ordering a drink from this mock cafe below! Work in progress
          inspired by my nearly daily coffee shop visits :) See planning doc{" "}
          <Anchor
            ariaLabel="notion planning document"
            href="https://quiet-fireman-c5b.notion.site/Practice-Design-Virtual-Coffee-Shop-b8a55929ef89459895d32a5004ca5ff2"
          >
            here
          </Anchor>
        </span>
      </div>
      <div className="coffee-shop-container">
        <div className="coffee-shop-border">
          <div className="coffee-shop-background">
            <div className="counter-container">
              <div className="upcoming-orders">
                {/* only ever show the upcoming 5 */}
                {orders
                  .slice(0, numOrdersToShow)
                  .reverse()
                  .map((order) => (
                    <DrinkOrder
                      orderType={order.type}
                      onClick={() => takeOrderFromCounter(order.id)}
                    />
                  ))}
              </div>
              <div className="counter"></div>
            </div>
            <div className="bottom">
              <div className="coffee-shop-board">
                <div className="current-balance">
                  <span>Your </span>
                  <span>Balance</span>
                  <Star>{" ∞ "}</Star>
                </div>

                <div className="menu-wrapper">
                  <button onClick={toggleMenu}>What would you like?</button>
                  {menuOpen && (
                    <div className="menu">
                      <button onClick={() => createOrder(OrderType.Cortado)}>
                        <span>{OrderType.Cortado}</span>{" "}
                        <span>{OrderPrice[OrderType.Cortado]}</span>
                      </button>
                      <button onClick={() => createOrder(OrderType.Americano)}>
                        <span>{OrderType.Americano}</span>{" "}
                        <span>{OrderPrice[OrderType.Americano]}</span>
                      </button>
                      <button onClick={() => createOrder(OrderType.Tea)}>
                        <span>{OrderType.Tea}</span>{" "}
                        <span>{OrderPrice[OrderType.Tea]}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="current-order">
                <DrinkOrder
                  orderType={activeDrinkType}
                  onClick={() => finishActiveDrink()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  amount: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
  onSubmitVotes: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateAmount,
  onSubmitVotes,
}) => {
  if (!isOpen) return null;

  const totalVotes = cartItems.reduce((total, item) => total + item.amount, 0);
  const remainingVotes = 100 - totalVotes;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Voting Cart
                  </h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flow-root">
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="py-6 flex">
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <div className="flex items-center ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onUpdateAmount(item.id, item.amount - 1)
                                }
                                disabled={item.amount <= 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <input
                                type="text"
                                value={item.amount}
                                onChange={(e) => {
                                  const value = Math.max(
                                    0,
                                    Math.min(
                                      remainingVotes + item.amount,
                                      Number(e.target.value)
                                    )
                                  );
                                  onUpdateAmount(item.id, value);
                                }}
                                className="mx-2 w-12 text-center border rounded-md"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onUpdateAmount(item.id, item.amount + 1)
                                }
                                disabled={totalVotes >= 100}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveItem(item.id)}
                                className="ml-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Total Votes</p>
                  <p>{totalVotes}/100</p>
                </div>
                <Button
                  onClick={onSubmitVotes}
                  className="w-full bg-gradient-to-r from-green-500 to-gray-700 text-white hover:from-green-600 hover:to-gray-800"
                >
                  Submit Votes
                </Button>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    or{" "}
                    <button
                      type="button"
                      className="text-green-600 font-medium hover:text-green-500"
                      onClick={onClose}
                    >
                      Continue Voting<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

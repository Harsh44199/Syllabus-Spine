import React from 'react';

const CheckoutPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-3xl font-bold mb-10">Complete Your Order</h1>
    <div className="grid md:grid-cols-3 gap-12">
      
      {/* Shipping Form */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200">
          <h3 className="font-bold mb-6">Shipping Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="col-span-2 w-full p-4 bg-slate-50 border-none rounded-xl" />
            <input type="text" placeholder="Phone Number" className="w-full p-4 bg-slate-50 border-none rounded-xl" />
            <input type="text" placeholder="Pincode" className="w-full p-4 bg-slate-50 border-none rounded-xl" />
            <textarea placeholder="Full Address (Hostel/Room/Street)" className="col-span-2 w-full p-4 bg-slate-50 border-none rounded-xl" rows="3" />
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
          <span className="text-2xl">🚚</span>
          <p className="text-sm text-blue-800">
            <strong>Standard Delivery:</strong> Notes are usually dispatched within 24 hours and delivered in 3-5 business days.
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-8 rounded-3xl sticky top-24">
          <h3 className="font-bold mb-6">Order Summary</h3>
          <div className="space-y-4 text-sm text-slate-400">
            <div className="flex justify-between"><span>Subtotal</span><span className="text-white">₹499</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-white font-bold text-green-400">FREE</span></div>
            <div className="pt-4 border-t border-slate-800 flex justify-between text-lg font-bold text-white">
              <span>Total</span><span>₹499</span>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white mt-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95">
            Proceed to Payment
          </button>
        </div>
      </div>

    </div>
  </div>
);

export default CheckoutPage;
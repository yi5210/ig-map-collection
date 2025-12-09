"use client";
import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [city, setCity] = useState("");
  const [note, setNote] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [errors, setErrors] = useState({
    url: "",
    nameOrAddress: "",
    city: "",
  });

  const validate = () => {
    let hasError = false;

    const newErrors = {
      url: "",
      nameOrAddress: "",
      city: "",
    };

    if (!url.trim()) {
      newErrors.url = "此欄位為必填";
      hasError = true;
    }

    if (!city.trim()) {
      newErrors.city = "此欄位為必填";
      hasError = true;
    }

    if (!name.trim() && !address.trim()) {
      newErrors.nameOrAddress = "店名與地址至少填寫一項";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const data = {
        url,
        name,
        address,
        category,
        subCategory,
        city,
        note,
        createdAt: new Date()
      };

      try {
        await addDoc(collection(db, "collections"), data);
        setSuccessMessage("已成功新增收藏！");

        // 清空欄位
        setUrl("");
        setName("");
        setAddress("");
        setCategory("");
        setSubCategory("");
        setCity("");
        setNote("");

        // 清除錯誤訊息
        setErrors({ url: "", nameOrAddress: "", city: "" });

        // 3 秒後自動消失
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("新增失敗：", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 md:py-8">
      <div className="relative max-w-2xl mx-auto px-4">
        
        {/* 成功訊息框 */}
        {successMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
            ✅ {successMessage}
          </div>
        )}

        {/* 主卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          
          {/* 回首頁按鈕 */}
          <div className="flex justify-start mb-6">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm md:text-base cursor-pointer font-medium"
            >
              ← 回首頁
            </button>
          </div>

          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              新增收藏
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              記錄你想去的美食店家
            </p>
          </div>

          {/* 表單區域 */}
          <div className="space-y-5">
            
            {/* IG URL */}
            <div>
              <label className="font-semibold text-gray-700 block mb-2 text-sm md:text-base flex items-center gap-1">
                <span className="text-lg">🔗</span>
                IG Reels 連結 
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full p-3 border-2 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                  errors.url ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="貼上 IG Reels 的網址"
              />
              {errors.url && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  ⚠️ {errors.url}
                </p>
              )}
            </div>

            {/* 店名與地址 */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* 店名 */}
              <div>
                <label className="font-semibold text-gray-700 block mb-2 text-sm md:text-base flex items-center gap-1">
                  <span className="text-lg">🏪</span>
                  店名
                </label>
                <input
                  type="text"
                  className={`w-full p-3 border-2 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                    errors.nameOrAddress ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="輸入店名"
                />
              </div>

              {/* 地址 */}
              <div>
                <label className="font-semibold text-gray-700 block mb-2 text-sm md:text-base flex items-center gap-1">
                  <span className="text-lg">📍</span>
                  地址
                </label>
                <input
                  type="text"
                  className={`w-full p-3 border-2 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                    errors.nameOrAddress ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="輸入地址"
                />
              </div>
            </div>
            
            {errors.nameOrAddress && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                ⚠️ {errors.nameOrAddress}
              </p>
            )}

            {/* 分類與城市 */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* 分類 */}
              <div>
                <label className="font-semibold text-gray-700 block mb-2 text-sm md:text-base flex items-center gap-1">
                  <span className="text-lg">🍽️</span>
                  分類
                </label>
                <select
                  className="w-full p-5 h-12 border-2 border-gray-200 rounded-lg text-sm md:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                  value={category}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCategory(value);
                    if (value !== "food") setSubCategory("");
                  }}
                >
                  <option value="">選擇分類</option>
                  <option value="food">食物</option>
                  <option value="drinks">飲料</option>
                  <option value="cafe">咖啡廳</option>
                  <option value="attraction">景點</option>
                </select>
              </div>

              {/* 城市 */}
              <div>
                <label className="font-semibold text-gray-700 block mb-2 text-sm md:text-base flex items-center gap-1">
                  <span className="text-lg">🌆</span>
                  城市 
                  <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full p-5 h-12 border-2 rounded-lg text-sm md:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white ${
                    errors.city ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">選擇城市</option>
                  <option value="台北">台北</option>
                  <option value="新北">新北</option>
                  <option value="桃園">桃園</option>
                  <option value="台中">台中</option>
                  <option value="彰化">彰化</option>
                  <option value="台南">台南</option>
                  <option value="高雄">高雄</option>
                </select>
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    ⚠️ {errors.city}
                  </p>
                )}
              </div>
            </div>

            {/* 食物類型（條件顯示） */}
            {category === "food" && (
              <div className="animate-fadeIn">
                <label className="font-semibold text-gray-700 block mb-2 text-sm md:text-base flex items-center gap-1">
                  <span className="text-lg">🍴</span>
                  食物類型
                </label>
                <select
                  className="w-full p-5 h-12 border-2 border-gray-200 rounded-lg text-sm md:text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                >
                  <option value="">選擇食物分類</option>
                  <option value="rice">米食</option>
                  <option value="noodle">麵食</option>
                  <option value="dessert">甜點</option>
                  <option value="hotpot">火鍋</option>
                  <option value="other">其他</option>
                </select>
              </div>
            )}

            {/* 備註 */}
            <div>
              <label className="font-semibold text-gray-700 block mb-2 text-sm md:text-base flex items-center gap-1">
                <span className="text-lg">📝</span>
                備註
                <span className="text-gray-400 text-xs">(選填)</span>
              </label>
              <textarea
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="想寫什麼都可以,例如:我想去的"
              />
            </div>

            {/* 儲存按鈕 */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 cursor-pointer text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
            >
              新增到收藏庫
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
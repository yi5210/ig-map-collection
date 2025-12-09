"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full">
      {/* 導航列 */}
      <nav className="bg-white shadow-lg rounded-2xl px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        {/* 提示文字 */}
        <div className="flex-1">
          <p className="text-base md:text-lg text-gray-600 font-medium">
            點擊右方按鈕開始創建清單、查看收藏庫
          </p>
        </div>

        {/* 按鈕組 */}
        <div className="flex gap-2 md:gap-3 flex-shrink-0">
          <Link href="/add">
            <button className="px-3 md:px-6 py-2 md:py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm md:text-base font-medium cursor-pointer">
              新增
            </button>
          </Link>
          <Link href="/collection">
            <button className="px-3 md:px-6 py-2 md:py-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm md:text-base font-medium cursor-pointer">
              收藏庫
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
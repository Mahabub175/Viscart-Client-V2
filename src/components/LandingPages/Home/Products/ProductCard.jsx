import { Rate, Tooltip } from "antd";
import Image from "next/image";
import React from "react";
import QuickViewHover from "../../Products/QuickViewHover";
import Link from "next/link";
import { useGetAllGlobalSettingQuery } from "@/redux/services/globalSetting/globalSettingApi";
import { formatImagePath } from "@/utilities/lib/formatImagePath";

const ProductCard = ({ title, data }) => {
  const { data: globalData } = useGetAllGlobalSettingQuery();

  return (
    <section className="py-10">
      {title && <h2 className="text-4xl font-bold text-center">{title}</h2>}
      {data?.length === 0 ? (
        <p className="text-center lg:text-xl font-semibold text-gray-500 my-10 lg:my-20">
          No {title} available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center items-center gap-6 mt-10">
          {data?.map((item) => (
            <div
              key={item?._id}
              className="bg-gray-100 border rounded-xl shadow-xl relative group w-[300px] h-[550px] mx-auto"
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <Image
                  src={formatImagePath(item?.mainImage)}
                  alt={item?.name}
                  width={300}
                  height={260}
                  className="rounded-t-xl h-[260px] group-hover:scale-110 duration-500"
                />
              </div>
              <QuickViewHover item={item} />
              <div className="px-5 pb-5">
                <div className="flex items-center mt-4 gap-4 font-bold">
                  <Rate disabled value={item?.ratings?.average} allowHalf />(
                  {item?.ratings?.count})
                </div>
                <Tooltip placement="top" title={item?.name}>
                  <h2 className="text-center font-semibold mt-6 mb-4">
                    {item?.name.length > 50
                      ? item.name.slice(0, 50).concat("...")
                      : item.name}
                  </h2>
                </Tooltip>
                <div className="flex items-center gap-4 justify-center">
                  {item?.offerPrice ? (
                    <p className="text-primary text-2xl font-bold">
                      {globalData?.results?.currency + " " + item?.offerPrice}
                    </p>
                  ) : (
                    <p className="text-primary text-2xl font-bold">
                      {globalData?.results?.currency + " " + item?.sellingPrice}
                    </p>
                  )}
                  {item?.offerPrice && (
                    <p className="text-base font-bold line-through text-red-500">
                      {globalData?.results?.currency + " " + item?.sellingPrice}
                    </p>
                  )}
                </div>
              </div>
              <Link
                href={`/products/${item?.slug}`}
                className="flex items-center justify-center absolute bottom-0 w-full"
              >
                <div className="bg-primary px-[6.5rem] text-white font-bold py-2 text-center rounded-b-xl">
                  View Details
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductCard;

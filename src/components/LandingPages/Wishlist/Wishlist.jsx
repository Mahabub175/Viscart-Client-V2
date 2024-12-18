"use client";

import { useCurrentUser } from "@/redux/services/auth/authSlice";
import {
  useDeleteWishlistMutation,
  useGetSingleWishlistByUserQuery,
} from "@/redux/services/wishlist/wishlistApi";
import { base_url_image } from "@/utilities/configs/base_api";
import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from "react-redux";
import deleteImage from "@/assets/images/Trash-can.png";
import Image from "next/image";
import { useState } from "react";
import DeleteModal from "@/components/Reusable/Modal/DeleteModal";
import QuickProductView from "@/components/Shared/Product/QuickProductView";
import { Button } from "antd";
import { useGetSingleProductQuery } from "@/redux/services/product/productApi";

const Wishlist = () => {
  const user = useSelector(useCurrentUser);

  const { data: wishlistData } = useGetSingleWishlistByUserQuery(user?._id);
  const [deleteWishlist] = useDeleteWishlistMutation();

  const [itemId, setItemId] = useState(null);
  const [productId, setProductId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (id) => {
    setProductId(id);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const { data: productData } = useGetSingleProductQuery(productId);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-2xl font-bold">
          Please login to see your wishlist
        </h2>
      </div>
    );
  }

  const formatImagePath = (imagePath) => {
    return imagePath?.replace(/\//g, "\\");
  };

  const handleDelete = (itemId) => {
    setItemId(itemId);
    setDeleteModalOpen(true);
  };

  return (
    <section className="container mx-auto px-5 py-10">
      <h2 className="font-normal text-2xl">My Wishlist</h2>
      <div>
        {wishlistData?.length === 0 ? (
          <div className="flex items-center justify-center h-screen">
            <h2 className="text-2xl font-bold text-black/80">
              Please add a product to wishlist to see them here
            </h2>
          </div>
        ) : (
          <div>
            <h2 className="font-normal text-xl mt-6">
              {wishlistData?.length} Items
            </h2>
            <div className="mt-10">
              {wishlistData?.map((item) => (
                <div
                  key={item?._id}
                  className="flex flex-col lg:flex-row items-center gap-4 justify-center mb-10 max-w-6xl mx-auto border-2 p-5 border-primary rounded-xl"
                >
                  <div className="flex flex-[2] items-center gap-4">
                    <Image
                      src={`${base_url_image}${
                        formatImagePath(item?.product?.mainImage) ||
                        "placeholder.jpg"
                      }`}
                      alt={item?.product?.name || "Product Image"}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-xl border-2 border-primary"
                    />
                    <Link
                      href={`/products/${item?.product?.slug}`}
                      className="text-xl font-normal hover:underline"
                    >
                      {item?.product?.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    {item?.product?.offerPrice ? (
                      <p className="text-primary text-2xl font-bold">
                        ${item?.product?.offerPrice}
                      </p>
                    ) : (
                      <p className="text-primary text-2xl font-bold">
                        ${item?.product?.sellingPrice}
                      </p>
                    )}
                    {item?.offerPrice && (
                      <p className="text-base font-bold line-through text-textColor">
                        ${item?.product?.sellingPrice}
                      </p>
                    )}
                  </div>
                  <div
                    onClick={() => handleDelete(item?._id)}
                    className="flex-1 "
                  >
                    <Image
                      height={20}
                      width={20}
                      src={deleteImage}
                      alt="delete image"
                      className="w-8 h-8 mx-auto hover:cursor-pointer hover:scale-110 duration-500"
                    />
                  </div>

                  <Button
                    htmlType="submit"
                    size="large"
                    type="primary"
                    icon={<FaCartShopping />}
                    onClick={() => showModal(item?.product?._id)}
                    className={`bg-primary hover:bg-secondary font-bold px-10 `}
                  >
                    Add To Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <QuickProductView
        item={productData}
        isModalVisible={isModalVisible}
        handleModalClose={handleModalClose}
      />

      <DeleteModal
        itemId={itemId}
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        text={"wishlist product"}
        func={deleteWishlist}
      />
    </section>
  );
};

export default Wishlist;

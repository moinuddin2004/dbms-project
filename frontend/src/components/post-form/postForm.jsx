import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import mime from "mime";

export default function PostForm({ post }) {
  console.log(post);
  const { register, handleSubmit, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      description: post?.description || "",
    },
  });
  const isThumbnailValid =
    typeof post?.thumbnail === "string" && post.thumbnail.trim() !== "";
  let isImage = isThumbnailValid && mime.getType(post.thumbnail)?.startsWith("image/");

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    let thumbnailUpdated = false;

    if (!post) {
      // Create new post
      console.log(data);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("thumbnail", data.thumbnail[0]);
      try {
        const response = await axios.post(
          "/api/v1/posts/create-post",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    } else {
      // Update existing post
      try {
     
        const postData = {
          title: data.title,
          description: data.description,
        };

        const response = await axios.patch(
          `/api/v1/posts/update-post/${post.id}`,
          postData
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }

      // Check if a new thumbnail is provided
      if (data.thumbnail.length > 0) {
        // Update thumbnail
        thumbnailUpdated = true;
        await updateThumbnail(data.thumbnail[0]);
      }
    }

    if (!thumbnailUpdated) {
      navigate("/profile");
    }
  };

  const updateThumbnail = async (newThumbnail) => {
    const thumbnailData = new FormData();
    thumbnailData.append("thumbnail", newThumbnail);
    try {
      const thumbnailResponse = await axios.patch(
        `/api/v1/posts/update-thumbnail/${post.id}`,
        thumbnailData
      );
      console.log(thumbnailResponse);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full">
      <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
        <div className="w-2/3 px-2 mt-[100px]">
          <Input
            label="Title :"
            placeholder="Title"
            className="mb-4"
            {...register("title", { required: true })}
          />
          <RTE
            label="description :"
            name="description"
            control={control}
            defaultValue={getValues("description")}
          />
        </div>
        <div className="w-1/3 px-2 mt-[100px]">
          <Input
            label="Thumbnail :"
            type="file"
            className="mb-4"
            accept="image/png, image/jpg, image/jpeg, image/gif,video/*"
            {...register("thumbnail", { required: !post })}
          />
          {post && (
            <div className="w-full mb-4">
              {isImage ? (
                <img
                  src={post.thumbnail} // Update this with the correct field name for thumbnail
                  alt={post.title}
                  className="rounded-lg"
                />
              ) : (
                <video
                  src={post.thumbnail}
                  controls
                  className="rounded-lg"
                ></video>
              )}
            </div>
          )}

          <Button
            type="submit"
            bgColor={post ? "bg-green-500" : undefined}
            className="w-full"
          >
            {post ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}

//   if (post) {
//   const file = data.image[0]
//     ? await appwriteService.uploadFile(data.image[0])
//     : null;

//   if (file) {
//     appwriteService.deleteFile(post.featuredImage);
//   }

//   const dbPost = await appwriteService.updatePost(post.$id, {
//     ...data,
//     featuredImage: file ? file.$id : undefined,
//   });

//   if (dbPost) {
//     navigate(`/post/${dbPost.$id}`);
//   }
// } else {
//   const file = await appwriteService.uploadFile(data.image[0]);

//   if (file) {
//     const fileId = file.$id;
//     data.featuredImage = fileId;
//     const dbPost = await appwriteService.createPost({
//       ...data,
//       userId: userData.$id,
//     });

//         if (dbPost) {
//           navigate(`/post/${dbPost.$id}`);
//         }
//       }
//     }

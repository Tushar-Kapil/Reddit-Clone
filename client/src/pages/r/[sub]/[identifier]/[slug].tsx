/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import classNames from "classnames";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import SideBar from "../../../../components/SideBar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { title } from "process";
import { useAuthState } from "../../../../context/auth";
import { FormEvent, useState } from "react";

dayjs.extend(relativeTime);

export default function PostPage() {
  const [newComment, setnewComment] = useState("");
  const { authenticated, user } = useAuthState();

  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  const { data: comments, mutate } = useSWR(
    identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
  );

  if (error) router.push("/");

  const vote = async (value: number, comment?) => {
    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    )
      value = 0;
    try {
      const res = await axios.post(
        "/misc/vote",
        {
          identifier,
          slug,
          commentIdentifier: comment?.identifier,
          value,
        },
        { withCredentials: true }
      );
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const submitComment = async (event: FormEvent) => {
    event.preventDefault();

    if (newComment.trim() === "") return;

    try {
      await axios.post(`/posts/${identifier}/${slug}/comments`, {
        body: newComment,
      });
      setnewComment("");

      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>{post?.title}</title>
      </Head>

      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    alt="image"
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  ></Image>
                </div>
              )}
              <p className="text-xl font-semibold text-white">/r/{sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5">
        {/* Post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <>
                <div className="flex">
                  <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                    <div
                      className="w-6 mx-auto text-center text-gray-400 rounded-l cursor-pointer hover:bg-gray-300 hover:text-red-500"
                      onClick={() => vote(1)}
                    >
                      <i
                        className={classNames("icon-arrow-up ", {
                          "text-red-500": post.userVote === 1,
                        })}
                      ></i>
                    </div>
                    <p className="text-sm font-bold">{post.voteScore}</p>
                    <div
                      className="w-6 mx-auto text-center text-gray-400 rounded-l cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                      onClick={() => vote(-1)}
                    >
                      <i
                        className={classNames("icon-arrow-down ", {
                          "text-blue-500": post.userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center">
                      <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${post.username}`}>
                          <a className="mx-1 hover:underline">
                            /u/{post.username}
                          </a>
                        </Link>
                        <Link href={`/r/${post.subName}/${identifier}/${slug}`}>
                          <a className="mx-1 hover:underline">
                            {dayjs(post.createdAt).fromNow()}
                          </a>
                        </Link>
                      </p>
                    </div>
                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                    <p className="my-3 text-sm">{post.body}</p>
                    <div className="flex">
                      <Link href={`/r/${post.subName}/${identifier}/${slug}`}>
                        <a>
                          <div className="px-1 py-1 mr-1 text-sm text-gray-400 rounded cursor-pointer hover:bg-gray-100">
                            <i className="mr-1 fas fa-comment-alt fa-sm"></i>
                            <span className="font-medium">
                              {post.commentCount} comments
                            </span>
                          </div>
                        </a>
                      </Link>
                      <div className="px-1 py-1 mr-1 text-sm text-gray-400 rounded cursor-pointer hover:bg-gray-100">
                        <i className="mr-1 fas fa-share "></i>
                        <span className="font-medium">Share</span>
                      </div>
                      <div className="px-1 py-1 mr-1 text-sm text-gray-400 rounded cursor-pointer hover:bg-gray-100">
                        <i className="mr-1 fas fa-bookmark fa-sm"></i>
                        <span className="font-medium">Save</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Comment Input */}
                <div className="pl-10 pr-6 mb-4">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        Comment as{" "}
                        <Link href={`/u/${user.username}`}>
                          <a className="text-blue-500 semi-bold">
                            {user.username}
                          </a>
                        </Link>
                      </p>
                      <form onSubmit={submitComment}>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                          onChange={(e) => setnewComment(e.target.value)}
                          value={newComment}
                        ></textarea>
                        <div className="flex justify-end">
                          <button className="px-3 py-1 blue button">
                            Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                      <p className="text-gray-500">
                        Log In or Sign Up to leave a comment
                      </p>
                      <div>
                        <Link href="/login">
                          <a className="px-4 py-1 mr-4 hollow blue button">
                            Log In
                          </a>
                        </Link>
                        <Link href="/register">
                          <a className="px-4 py-1 blue button">Sign Up</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <hr />
                {comments?.map((comment) => (
                  <div className="flex" key={comment.identifier}>
                    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l ">
                      <div
                        className="w-6 mx-auto text-center text-gray-400 rounded-l cursor-pointer hover:bg-gray-300 hover:text-red-500"
                        onClick={() => vote(1, comment)}
                      >
                        <i
                          className={classNames("icon-arrow-up ", {
                            "text-red-500": comment.userVote === 1,
                          })}
                        ></i>
                      </div>
                      <p className="text-sm font-bold">{comment.voteScore}</p>
                      <div
                        className="w-6 mx-auto text-center text-gray-400 rounded-l cursor-pointer hover:bg-gray-300 hover:text-blue-500"
                        onClick={() => vote(-1, comment)}
                      >
                        <i
                          className={classNames("icon-arrow-down ", {
                            "text-blue-500": comment.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                    <div className="py-2 pr-2">
                      <p className="mb-1 text-xs leading-none">
                        <Link href={`/u/${comment.username}`}>
                          <a className="mr-1 font-bold hover:underline">
                            {comment.username}
                          </a>
                        </Link>
                        <span className="text-gray-600">
                          {`
                            ${comment.voteScore}
                            points •
                            ${dayjs(comment.createdAt).fromNow()}
                          `}
                        </span>
                      </p>
                      <p>{comment.body}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        {/* SideBar */}
        {post && <SideBar sub={post.sub} />}
      </div>
    </>
  );
}

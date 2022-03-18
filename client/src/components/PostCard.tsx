/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Axios from "axios";
import classNames from "classnames";
import { mutate } from "swr";
dayjs.extend(relativeTime);

export default function PostCard({
  post: {
    identifier,
    voteScore,
    subName,
    slug,
    username,
    title,
    commentCount,
    body,
    createdAt,
    userVote,
  },
  mutate,
}) {
  const vote = async (value) => {
    try {
      const res = await Axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });

      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div key={identifier} className="flex mb-4 bg-white rounded">
      {/* Vote Section */}
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        <div
          className="w-6 mx-auto text-center text-gray-400 bg-gray-200 rounded-l cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <i
            className={classNames("icon-arrow-up ", {
              "text-red-500": userVote === 1,
            })}
          ></i>
        </div>
        <p className="text-sm font-bold">{voteScore}</p>
        <div
          className="w-6 mx-auto text-center text-gray-400 bg-gray-200 rounded-l cursor-pointer hover:bg-gray-300 hover:text-blue-500"
          onClick={() => vote(-1)}
        >
          <i
            className={classNames("icon-arrow-down ", {
              "text-blue-500": userVote === -1,
            })}
          ></i>
        </div>
      </div>
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${subName}`} passHref>
            <img
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              className="w-6 h-6 mr-1 rounded-full cursor-pointer"
              alt="profile"
            />
          </Link>
          <Link href={`/r/${subName}`}>
            <a className="text-xs font-bold cursor-pointer hover:underline">
              /r/{subName}
            </a>
          </Link>
          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span>
            Posted by
            <Link href={`/u/${username}`}>
              <a className="mx-1 hover:underline">/u/{username}</a>
            </Link>
            <Link href={`/r/${subName}/${identifier}/${slug}`}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={`/r/${subName}/${identifier}/${slug}`}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}

        <div className="flex">
          <Link href={`/r/${subName}/${identifier}/${slug}`}>
            <a>
              <div className="px-1 py-1 mr-1 text-sm text-gray-400 rounded cursor-pointer hover:bg-gray-100">
                <i className="mr-1 fas fa-comment-alt fa-sm"></i>
                <span className="font-medium">{commentCount} comments</span>
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
  );
}

/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostCard from "../components/PostCard";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "../context/auth";

dayjs.extend(relativeTime);

export default function Home() {
  const { data: posts } = useSWR("/posts");
  const { data: topSubs } = useSWR("/misc/top-subs");

  const { authenticated } = useAuthState();

  return (
    <Fragment>
      <Head>
        <title>Reddit - Dive into anything</title>
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <div className="container flex pt-4">
        {/* Posts */}
        <div className=" w-160">
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier}></PostCard>
          ))}
        </div>
        {/* SideBar */}
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-xl font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <div className="mr-2 overflow-hidden rounded-full hover:cursor-pointer">
                    <Link href={`/r/${sub.name}`} passHref>
                      <a>
                        <Image
                          src={sub.imageUrl}
                          alt="sub"
                          width={(6 * 16) / 4}
                          height={(6 * 16) / 4}
                        />
                      </a>
                    </Link>
                  </div>
                  <Link href={`/r/${sub.name}`}>
                    <a className="font-bold hover:cursor-pointer">
                      /r/{sub.name}
                    </a>
                  </Link>
                  <p className="ml-auto font-med">{sub.postCount}</p>
                </div>
              ))}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-2 py-1 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

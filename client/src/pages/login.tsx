import Head from "next/head";
import Link from "next/link";
import { FormEvent, useState } from "react";
import Axios from "axios";
import classNames from "classnames";
import router, { useRouter } from "next/router";
import { useAuthDispatch, useAuthState } from "../context/auth";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<any>({});

  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  const router = useRouter();
  if (authenticated) router.push("/");

  const submitHandler = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await Axios.post(
        "/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      dispatch({ type: "LOGIN", payload: res.data });

      router.push("/");
    } catch (err) {
      setErrors(err.response.data);
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/images/logo.png" />
      </Head>

      <div
        className="w-40 h-screen bg-cover"
        style={{ backgroundImage: "url('/images/redditRegister.png')" }}
      ></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-xl font-medium">Login</h1>
          <p className="mb-6 text-sm ">
            By continuing, you agree to our
            <span className="text-blue-500 transition-all duration-100 hover:text-blue-400 hover:cursor-pointer">
              {" "}
              User Agreement
            </span>{" "}
            and
            <span className="text-blue-500 transition-all duration-100 hover:text-blue-400 hover:cursor-pointer">
              {" "}
              Privacy Policy.
            </span>
          </p>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <input
                type="text"
                className={classNames(
                  "w-full px-3 py-3 text-sm transition-all duration-500 border border-gray-300 rounded outline-none bg-zinc-50 hover:bg-white focus:bg-white",
                  { "border-red-600": errors.username }
                )}
                placeholder="USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <small className="font-medium text-red-600">
                {errors.username}
              </small>
            </div>
            <div className="mb-4">
              <input
                type="password"
                className={classNames(
                  "w-full px-3 py-3 text-sm  transition-all duration-500 border border-gray-300 rounded outline-none bg-zinc-50 hover:bg-white focus:bg-white",
                  { "border-red-600": errors.password }
                )}
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small className="font-medium text-red-600">
                {errors.password}
              </small>
            </div>
            <button className="w-full py-2 mb-4 text-base font-bold text-white uppercase transition-all duration-100 bg-blue-500 border border-blue-500 border-none rounded hover:bg-blue-400 hover:border-blue-400">
              Login
            </button>
          </form>
          <small className="text-sm">
            New to Reddit?
            <Link href="/register">
              <a className="ml-1 font-bold text-blue-500 uppercase transition-all duration-100 hover:text-blue-400">
                SIGN UP
              </a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

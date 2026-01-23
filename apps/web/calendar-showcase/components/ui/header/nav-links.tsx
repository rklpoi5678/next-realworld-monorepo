"use client";

import Avatar from "#/components/avatar/avatar";
import { useUser } from "#/hooks/use-user";

import { DarkModeToggle } from "./dark-mode-toggle";
import { EditIcon, HomeIcon, RegisterIcon, SettingsIcon } from "./icons";
import { NavLink } from "./nav-link";

interface NavLinksProps {
  isMobile?: boolean
}

export const NavLinks = ({ isMobile }: NavLinksProps) => {
  const { user, isLoggedIn } = useUser();

  return (
    <>
      <li className="md:translate-y-1px">
        <DarkModeToggle />
      </li>
      <li>
        <NavLink href="/" isMobile={isMobile} end>
          {isMobile && <HomeIcon />}
          <span>글 목록</span>
        </NavLink>
      </li>
      {isLoggedIn ? (
        <>
          <li>
            <NavLink href="/editor" isMobile={isMobile} >
              {isMobile && <EditIcon />}
              <span>글 작성</span>
            </NavLink>
          </li>
          <li>
            <NavLink href="/settings" isMobile={isMobile} >
              {isMobile && <SettingsIcon />}
              <span>설정</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              href={`/profile/${user?.username}`}
              isMobile={isMobile}
              classes="md:flex md:gap-1 md:translate-y-[1px]"
            >
              <Avatar
                user={user}
                size={isMobile ? "sm" : "md"}
                className={isMobile ? "" : "mr-1"}
              />
              <span className="translate-y-1px lg:translate-y-2px">
                {user?.username}
              </span>
            </NavLink>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink href="/login" isMobile={isMobile} >
              {isMobile && <SettingsIcon />}
              <span>로그인</span>
            </NavLink>
          </li>
          <li>
            <NavLink href="/register" isMobile={isMobile}>
              {isMobile && <RegisterIcon />}
              <span>회원가입</span>
            </NavLink>
          </li>
        </>
      )}
    </>
  )
}
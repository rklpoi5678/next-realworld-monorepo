import { Metadata } from "next";

import { Profile } from "./_components/profile";

export const metadata:Metadata = {
    title: 'Profile',
    description: 'Profile'
}

export default function ProfilePage() {
    return <Profile />
}
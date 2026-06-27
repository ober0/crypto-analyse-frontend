'use client'

/* eslint-disable react-perf/jsx-no-new-function-as-prop */
import LightRays from '@/components/LightRays'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/entities/auth/api/use-login'
import { useCallback, useState } from 'react'

export default function AuthPage() {
    const [form, setForm] = useState({ login: '', password: '' })

    const { mutate, isPending } = useLogin()

    const handleLogin = useCallback(() => {
        if (form.login.trim().length !== 0 && form.password.trim().length !== 0) {
            mutate({ username: form.login, password: form.password })
        }
    }, [form.login, form.password, mutate])

    return (
        <>
            <div className="-z-100 absolute left-0 top-0 h-screen w-full">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#00ffff"
                    raysSpeed={1.5}
                    lightSpread={0.8}
                    rayLength={1.2}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0.1}
                    distortion={0.05}
                />
            </div>
            <div className="border-primary/50 bg-background/30 m-auto mt-20 flex w-3/4 flex-col items-center rounded-lg border p-4 backdrop-blur lg:w-1/4">
                <p className="text-xl font-black">Авторизация</p>
                <div className="mt-4 flex w-full flex-col gap-1">
                    <Input
                        placeholder="Логин"
                        value={form.login}
                        onChange={(e) => setForm((prev) => ({ ...prev, login: e.target.value }))}
                        className="cursor-target"
                    />
                    <Input
                        placeholder="Пароль"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                        className="cursor-target"
                    />
                    <Button onClick={handleLogin} className="cursor-target mt-4" loading={isPending}>
                        Войти
                    </Button>
                </div>
            </div>
        </>
    )
}

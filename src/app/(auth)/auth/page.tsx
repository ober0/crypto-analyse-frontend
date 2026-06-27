'use client'

/* eslint-disable react-perf/jsx-no-new-function-as-prop */
import LightRays from '@/components/LightRays'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/entities/auth/api/use-login'
import { cn } from '@/shared/utils'
import { LockKeyhole, Sparkles, UserRound } from 'lucide-react'
import { useCallback, useState } from 'react'

export default function AuthPage() {
    const [form, setForm] = useState({ login: '', password: '' })

    const { mutate, isPending } = useLogin()

    const handleLogin = useCallback(() => {
        if (form.login.trim().length !== 0 && form.password.trim().length !== 0) {
            mutate({ username: form.login, password: form.password })
        }
    }, [form.login, form.password, mutate])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') handleLogin()
        },
        [handleLogin]
    )

    return (
        <>
            <div className="pointer-events-none fixed inset-0 -z-10">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#668cff"
                    raysSpeed={1.2}
                    lightSpread={0.9}
                    rayLength={1.4}
                    followMouse={true}
                    mouseInfluence={0.12}
                    noiseAmount={0.08}
                    distortion={0.04}
                />
            </div>

            <div className="relative w-full max-w-lg">
                <div className="border-primary/30 bg-background/40 absolute -inset-px rounded-2xl bg-linear-to-b from-primary/20 via-transparent to-violet-500/10 blur-sm" />

                <div className="border-primary/40 bg-background/60 relative flex flex-col gap-6 rounded-2xl border p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="from-primary/20 to-violet-500/20 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-linear-to-br">
                            <Sparkles className="text-primary size-7" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold tracking-tight">Прогнозы</h1>
                            <p className="text-muted-foreground text-sm">Войдите, чтобы открыть панель анализа</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5" onKeyDown={handleKeyDown}>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="login" className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                                Логин
                            </Label>
                            <div className="relative">
                                <UserRound className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                                <Input
                                    id="login"
                                    placeholder="Введите логин"
                                    value={form.login}
                                    onChange={(e) => setForm((prev) => ({ ...prev, login: e.target.value }))}
                                    className="cursor-target h-12 pl-10 text-base"
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password" className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                                Пароль
                            </Label>
                            <div className="relative">
                                <LockKeyhole className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                                <Input
                                    id="password"
                                    placeholder="Введите пароль"
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                                    className="cursor-target h-12 pl-10 text-base"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleLogin}
                            className={cn('cursor-target mt-2 h-12 text-base font-semibold')}
                            loading={isPending}
                            disabled={!form.login.trim() || !form.password.trim()}
                        >
                            Войти
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

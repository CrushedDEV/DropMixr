import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Save, Settings as SettingsIcon, Coins, Download, Upload } from 'lucide-react';

interface Setting {
    id: number;
    key: string;
    value: string;
}

interface Props {
    settings: Setting[];
}

export default function AdminSettings({ settings }: Props) {
    const { flash } = usePage().props as any;

    const findSetting = (key: string) => settings.find((s) => s.key === key)?.value || '0';

    const [creditCostDownload, setCreditCostDownload] = useState(findSetting('credit_cost_download'));
    const [creditRewardUpload, setCreditRewardUpload] = useState(findSetting('credit_reward_upload'));
    const [storageLimitMb, setStorageLimitMb] = useState(findSetting('storage_limit_mb'));
    const [dailyUploadLimit, setDailyUploadLimit] = useState(findSetting('daily_upload_limit'));
    const [maxFileSizeMb, setMaxFileSizeMb] = useState(findSetting('max_file_size_mb'));
    const [discordWebhookUrl, setDiscordWebhookUrl] = useState(findSetting('discord_webhook_url') === '0' ? '' : findSetting('discord_webhook_url'));
    const [saving, setSaving] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.post('/admin/settings', {
            credit_cost_download: creditCostDownload,
            credit_reward_upload: creditRewardUpload,
            storage_limit_mb: storageLimitMb,
            daily_upload_limit: dailyUploadLimit,
            max_file_size_mb: maxFileSizeMb,
            discord_webhook_url: discordWebhookUrl,
        }, {
            onSuccess: () => setSaving(false),
            onError: () => setSaving(false),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Configuración', href: '/admin/settings' }]}>
            <Head title="Configuración - Admin" />

            <div className="p-6 max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                        <SettingsIcon className="h-8 w-8 text-pink-500" />
                        Configuración
                    </h1>
                    <p className="text-gray-400 mt-2">Configura el sistema de créditos</p>
                </div>

                {flash?.success && (
                    <div className="mb-6 rounded-lg bg-green-500/20 border border-green-500/50 px-4 py-3 text-green-400">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Coins className="h-5 w-5 text-amber-400" />
                            Sistema de Créditos
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                    <Download className="h-4 w-4 text-blue-400" />
                                    Costo de descarga (créditos)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={creditCostDownload}
                                    onChange={(e) => setCreditCostDownload(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                                />
                                <p className="mt-1.5 text-sm text-gray-500">
                                    Créditos que se deducen cuando un usuario descarga un mashup
                                </p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                    <Upload className="h-4 w-4 text-green-400" />
                                    Recompensa por subida (créditos)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={creditRewardUpload}
                                    onChange={(e) => setCreditRewardUpload(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                                />
                                <p className="mt-1.5 text-sm text-gray-500">
                                    Créditos que recibe un usuario cuando su mashup es aprobado
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Upload className="h-5 w-5 text-purple-400" />
                            Límites y Quotas
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                    Límite de Almacenamiento (MB)
                                </label>
                                <input
                                    type="number"
                                    min="10"
                                    value={storageLimitMb}
                                    onChange={(e) => setStorageLimitMb(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                    Límite de Subidas Diarias
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={dailyUploadLimit}
                                    onChange={(e) => setDailyUploadLimit(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                    Tamaño Máximo Archivo (MB)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={maxFileSizeMb}
                                    onChange={(e) => setMaxFileSizeMb(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="text-2xl">📢</span>
                            Notificaciones
                        </h2>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                                Discord Webhook URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://discord.com/api/webhooks/..."
                                value={discordWebhookUrl}
                                onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors"
                            />
                            <p className="mt-1.5 text-sm text-gray-500">
                                URL del Webhook de Discord para avisar de nuevos contenidos.
                            </p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 py-3"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

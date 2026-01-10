import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trophy } from 'lucide-react';

const TopPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">ポーカーの記録</h1>

            <div className="grid grid-cols-1 gap-6 w-full max-w-md">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { }}>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <FileText className="h-6 w-6 text-blue-500" />
                            <span>ハンド記録 (単発)</span>
                        </CardTitle>
                        <CardDescription>
                            1ハンドごとの詳細な記録をとります。
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/record">
                            <Button className="w-full">記録する</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { }}>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Trophy className="h-6 w-6 text-amber-500" />
                            <span>トーナメント記録</span>
                        </CardTitle>
                        <CardDescription>
                            チップ推移や戦績を管理します。
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/tournaments">
                            <Button variant="outline" className="w-full">一覧を見る</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TopPage;

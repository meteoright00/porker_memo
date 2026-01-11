import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Trophy } from 'lucide-react';

const TopPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Poker Note</h1>

            <div className="grid grid-cols-1 gap-6 w-full max-w-md">
                <Link to="/record" className="block">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
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
                            <div className="text-primary font-medium flex items-center">
                                記録する <span className="ml-2">→</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/tournaments" className="block">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
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
                            <div className="text-primary font-medium flex items-center">
                                一覧を見る <span className="ml-2">→</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default TopPage;

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";

interface Player {
  id: string;
  name: string;
  isAlive: boolean;
  joinedAt: Date;
  avatar: string;
}

interface GameState {
  isStarted: boolean;
  round: number;
  timeLeft: number;
  playersAlive: number;
  totalPlayers: number;
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "1",
      name: "Александр",
      isAlive: true,
      joinedAt: new Date(),
      avatar: "🧑‍💼",
    },
    {
      id: "2",
      name: "Мария",
      isAlive: true,
      joinedAt: new Date(),
      avatar: "👩‍🔬",
    },
    {
      id: "3",
      name: "Дмитрий",
      isAlive: true,
      joinedAt: new Date(),
      avatar: "🧑‍🎨",
    },
  ]);

  const [gameState, setGameState] = useState<GameState>({
    isStarted: false,
    round: 1,
    timeLeft: 300,
    playersAlive: 3,
    totalPlayers: 3,
  });

  const [isAdmin, setIsAdmin] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (gameState.isStarted && gameState.timeLeft > 0) {
      const timer = setInterval(() => {
        setGameState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState.isStarted, gameState.timeLeft]);

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;

    const avatars = ["🧑‍💼", "👩‍🔬", "🧑‍🎨", "👩‍💻", "🧑‍🚀", "👩‍⚕️", "🧑‍🔧", "👩‍🎓"];
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName,
      isAlive: true,
      joinedAt: new Date(),
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
    };

    setPlayers((prev) => [...prev, newPlayer]);
    setGameState((prev) => ({
      ...prev,
      totalPlayers: prev.totalPlayers + 1,
      playersAlive: prev.playersAlive + 1,
    }));
    setNewPlayerName("");
  };

  const eliminatePlayer = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isAlive: false } : p)),
    );
    setGameState((prev) => ({ ...prev, playersAlive: prev.playersAlive - 1 }));
    setSelectedPlayer(null);
  };

  const startGame = () => {
    setGameState((prev) => ({ ...prev, isStarted: true, timeLeft: 300 }));
  };

  const resetGame = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, isAlive: true })));
    setGameState({
      isStarted: false,
      round: 1,
      timeLeft: 300,
      playersAlive: players.length,
      totalPlayers: players.length,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const alivePlayers = players.filter((p) => p.isAlive);
  const deadPlayers = players.filter((p) => !p.isAlive);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            🔥 ИГРА НА ВЫЖИВАНИЕ
          </h1>
          <p className="text-xl text-slate-300">Последний выживший побеждает</p>
        </div>

        {/* Игровая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  {gameState.playersAlive}
                </div>
                <div className="text-sm text-slate-400">Выживших</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">
                  {deadPlayers.length}
                </div>
                <div className="text-sm text-slate-400">Исключенных</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {gameState.round}
                </div>
                <div className="text-sm text-slate-400">Раунд</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">
                  {gameState.isStarted
                    ? formatTime(gameState.timeLeft)
                    : "5:00"}
                </div>
                <div className="text-sm text-slate-400">Время раунда</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Активные игроки */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" size={24} />
                  Активные игроки ({alivePlayers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {alivePlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all animate-pulse"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-slate-400">
                            <Icon
                              name="Clock"
                              size={14}
                              className="inline mr-1"
                            />
                            {player.joinedAt.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      {isAdmin && gameState.isStarted && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setSelectedPlayer(player)}
                            >
                              <Icon name="X" size={16} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-800 border-slate-700">
                            <DialogHeader>
                              <DialogTitle className="text-red-400">
                                Исключить игрока?
                              </DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-slate-300">
                                Вы уверены, что хотите исключить игрока{" "}
                                <strong>{player.name}</strong>?
                              </p>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline">Отмена</Button>
                              <Button
                                variant="destructive"
                                onClick={() => eliminatePlayer(player.id)}
                              >
                                Исключить
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Исключенные игроки */}
            {deadPlayers.length > 0 && (
              <Card className="bg-slate-800 border-slate-700 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <Icon name="Skull" size={24} />
                    Исключенные игроки ({deadPlayers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {deadPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 p-3 bg-red-900/20 rounded-lg opacity-60"
                      >
                        <div className="text-xl grayscale">{player.avatar}</div>
                        <div>
                          <div className="font-medium line-through">
                            {player.name}
                          </div>
                          <div className="text-sm text-red-400">Исключен</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Панель управления */}
          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Settings" size={24} />
                  {isAdmin ? "Панель админа" : "Панель игрока"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Добавление игрока */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Добавить игрока
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      placeholder="Имя игрока"
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400"
                      onKeyPress={(e) => e.key === "Enter" && addPlayer()}
                    />
                    <Button onClick={addPlayer} size="sm">
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>

                {/* Управление игрой */}
                {isAdmin && (
                  <div className="space-y-2">
                    <Button
                      onClick={startGame}
                      disabled={gameState.isStarted || alivePlayers.length < 3}
                      className="w-full"
                      variant={gameState.isStarted ? "secondary" : "default"}
                    >
                      <Icon name="Play" size={16} className="mr-2" />
                      {gameState.isStarted ? "Игра идет" : "Начать игру"}
                    </Button>

                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="w-full"
                    >
                      <Icon name="RotateCcw" size={16} className="mr-2" />
                      Сбросить игру
                    </Button>

                    <Button
                      onClick={() => setIsAdmin(!isAdmin)}
                      variant="ghost"
                      className="w-full"
                    >
                      <Icon name="User" size={16} className="mr-2" />
                      {isAdmin ? "Выйти из админки" : "Войти как админ"}
                    </Button>
                  </div>
                )}

                {/* Статус игры */}
                <div className="pt-4 border-t border-slate-700">
                  <div className="text-sm text-slate-400">
                    Статус:{" "}
                    {gameState.isStarted ? (
                      <span className="text-green-400">Игра идет</span>
                    ) : (
                      <span className="text-yellow-400">Ожидание</span>
                    )}
                  </div>
                  {alivePlayers.length < 3 && !gameState.isStarted && (
                    <div className="text-sm text-red-400 mt-1">
                      Минимум 3 игрока для старта
                    </div>
                  )}
                  {alivePlayers.length === 1 && gameState.isStarted && (
                    <div className="text-sm text-green-400 mt-1">
                      🏆 Победитель: {alivePlayers[0].name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

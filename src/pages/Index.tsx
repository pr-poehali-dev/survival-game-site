import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Icon from "@/components/ui/icon";

interface Room {
  id: string;
  code: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  isStarted: boolean;
  createdAt: Date;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<"menu" | "lobby">("menu");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = () => {
    if (!playerName.trim()) {
      toast.error("Введите ваше имя");
      return;
    }

    const code = generateRoomCode();
    const playerId = Date.now().toString();

    const player: Player = {
      id: playerId,
      name: playerName,
      avatar: "🎮",
      isHost: true,
    };

    const room: Room = {
      id: Date.now().toString(),
      code,
      name: `Подвал ${playerName}`,
      players: [player],
      maxPlayers: 8,
      isStarted: false,
      createdAt: new Date(),
    };

    setCurrentRoom(room);
    setCurrentPlayer(player);
    setCurrentView("lobby");
    toast.success(`Комната создана! Код: ${code}`);
  };

  const joinRoom = () => {
    if (!playerName.trim()) {
      toast.error("Введите ваше имя");
      return;
    }
    if (!roomCode.trim()) {
      toast.error("Введите код комнаты");
      return;
    }

    // Симуляция входа в комнату
    const playerId = Date.now().toString();
    const player: Player = {
      id: playerId,
      name: playerName,
      avatar: "🎯",
      isHost: false,
    };

    const room: Room = {
      id: roomCode,
      code: roomCode.toUpperCase(),
      name: `Комната ${roomCode}`,
      players: [{ id: "1", name: "Хост", avatar: "👑", isHost: true }, player],
      maxPlayers: 8,
      isStarted: false,
      createdAt: new Date(),
    };

    setCurrentRoom(room);
    setCurrentPlayer(player);
    setCurrentView("lobby");
    toast.success(`Подключились к комнате ${roomCode.toUpperCase()}`);
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    setCurrentPlayer(null);
    setCurrentView("menu");
    setRoomCode("");
    toast.info("Вы покинули комнату");
  };

  const copyRoomCode = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.code);
      toast.success("Код скопирован!");
    }
  };

  const startGame = () => {
    if (currentRoom && currentPlayer?.isHost) {
      toast.success("Игра начинается!");
      // Здесь будет переход к игре
    }
  };

  if (currentView === "lobby" && currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок лобби */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
              🏠 Подвал Гикоса - Лобби
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="text-xl">
                Код подвала:{" "}
                <span className="font-mono font-bold text-orange-400">
                  {currentRoom.code}
                </span>
              </div>
              <Button onClick={copyRoomCode} size="sm" variant="outline">
                <Icon name="Copy" size={16} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Список игроков */}
            <div className="lg:col-span-2">
              <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Users" size={24} />
                    Игроки ({currentRoom.players.length}/
                    {currentRoom.maxPlayers})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentRoom.players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 p-3 bg-white/10 rounded-lg"
                      >
                        <div className="text-2xl">{player.avatar}</div>
                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-2">
                            {player.name}
                            {player.isHost && (
                              <span className="text-yellow-400 text-sm">
                                👑 Хост
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-300">
                            {player.id === currentPlayer?.id
                              ? "Это вы"
                              : "Игрок"}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Пустые слоты */}
                    {Array.from({
                      length:
                        currentRoom.maxPlayers - currentRoom.players.length,
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border-2 border-dashed border-gray-600"
                      >
                        <div className="text-2xl opacity-50">👤</div>
                        <div className="text-gray-400">Ожидание игрока...</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Панель управления */}
            <div>
              <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Settings" size={24} />
                    Управление
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentPlayer?.isHost ? (
                    <>
                      <Button
                        onClick={startGame}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        disabled={currentRoom.players.length < 2}
                      >
                        <Icon name="Play" size={16} className="mr-2" />
                        Начать игру
                      </Button>

                      {currentRoom.players.length < 2 && (
                        <p className="text-sm text-yellow-400 text-center">
                          Нужно минимум 2 игрока
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-300">
                      <Icon name="Clock" size={32} className="mx-auto mb-2" />
                      <p>Ожидание начала игры...</p>
                      <p className="text-sm">Хост начнет игру</p>
                    </div>
                  )}

                  <Button
                    onClick={leaveRoom}
                    variant="destructive"
                    className="w-full"
                  >
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Покинуть комнату
                  </Button>

                  <div className="pt-4 border-t border-gray-600">
                    <div className="text-sm text-gray-400">
                      <div>
                        Создана: {currentRoom.createdAt.toLocaleTimeString()}
                      </div>
                      <div>
                        Статус: <span className="text-green-400">Ожидание</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
            🏠 Подвал Гикоса
          </h1>
          <p className="text-xl text-gray-300">
            Тайное место для дружеских игр и общения по кодам приглашения
          </p>
        </div>

        {/* Основные действия */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Создать комнату */}
          <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm hover:border-purple-400/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Icon name="Plus" size={28} />
                Создать комнату
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ваше имя
                </label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === "Enter" && createRoom()}
                />
              </div>

              <Button
                onClick={createRoom}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-lg py-6"
              >
                <Icon name="Gamepad2" size={20} className="mr-2" />
                Создать и начать
              </Button>

              <p className="text-sm text-gray-400 text-center">
                Создайте комнату и получите код для друзей
              </p>
            </CardContent>
          </Card>

          {/* Присоединиться */}
          <Card className="bg-black/20 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Icon name="Users" size={28} />
                Присоединиться
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ваше имя
                </label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="bg-white/10 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Код комнаты
                </label>
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Введите код"
                  className="bg-white/10 border-gray-600 text-white placeholder-gray-400 font-mono text-center"
                  maxLength={6}
                  onKeyPress={(e) => e.key === "Enter" && joinRoom()}
                />
              </div>

              <Button
                onClick={joinRoom}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg py-6"
              >
                <Icon name="LogIn" size={20} className="mr-2" />
                Подключиться
              </Button>

              <p className="text-sm text-gray-400 text-center">
                Введите код от друга для входа в игру
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Популярные игры */}
        <Card className="bg-black/20 border-gray-600/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Trophy" size={24} />
              Доступные игры
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white/10 rounded-lg text-center">
                <div className="text-3xl mb-2">🔥</div>
                <div className="font-semibold">Выживание</div>
                <div className="text-sm text-gray-400">Битва до последнего</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg text-center opacity-60">
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-semibold">Викторина</div>
                <div className="text-sm text-gray-400">Скоро...</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg text-center opacity-60">
                <div className="text-3xl mb-2">🎲</div>
                <div className="font-semibold">Мафия</div>
                <div className="text-sm text-gray-400">Скоро...</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

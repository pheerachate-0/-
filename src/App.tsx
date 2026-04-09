/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Sword, Heart, Trophy, RefreshCw } from 'lucide-react';

// --- ประเภทข้อมูล ---
type GameState = 'LOBBY' | 'PLAYING' | 'RESULT';
type Rank = 'อัศวินฝึกหัด' | 'อัศวินองครักษ์' | 'อัศวินมังกร' | 'มหาอัศวินผู้พิทักษ์';

export default function App() {
  // --- States ของเกม ---
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [selectedTable, setSelectedTable] = useState<number | 'RANDOM'>(2);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(3);
  const [round, setRound] = useState(1);
  const [problem, setProblem] = useState({ a: 0, b: 0, answer: 0 });
  const [userInput, setUserInput] = useState('');
  const [dragonPos, setDragonPos] = useState(0); // 0 (ไกล) ถึง 100 (ถึงปราสาท)
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);

  // --- ฟังก์ชันสร้างโจทย์ ---
  const generateProblem = useCallback(() => {
    const a = selectedTable === 'RANDOM' ? Math.floor(Math.random() * 11) + 2 : selectedTable;
    const b = Math.floor(Math.random() * 11) + 2;
    setProblem({ a, b, answer: a * b });
    setDragonPos(0);
    setUserInput('');
    setFeedback(null);
  }, [selectedTable]);

  // --- เริ่มเกม ---
  const startGame = (mode: number | 'RANDOM') => {
    setSelectedTable(mode);
    setScore(0);
    setHp(3);
    setRound(1);
    setGameState('PLAYING');
    // ใช้ timeout เล็กน้อยเพื่อให้ state อัปเดตก่อนสร้างโจทย์
    setTimeout(() => generateProblem(), 0);
  };

  // --- ระบบจับเวลา (มังกรเดิน) ---
  useEffect(() => {
    if (gameState === 'PLAYING') {
      const timer = setInterval(() => {
        setDragonPos((prev) => {
          if (prev >= 100) {
            handleWrong(true); // มังกรถึงปราสาท = ผิด
            return 0;
          }
          return prev + 1.5; // ความเร็วของมังกร (ปรับตรงนี้ได้)
        });
      }, 150);
      return () => clearInterval(timer);
    }
  }, [gameState, dragonPos, generateProblem]);

  const [isShaking, setIsShaking] = useState(false);

  // --- จัดการเมื่อตอบผิดหรือมังกรบุกสำเร็จ ---
  const handleWrong = (isTimeOut = false) => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    setHp((prev) => {
      const newHp = prev - 1;
      if (newHp <= 0) {
        setGameState('RESULT');
      }
      return newHp;
    });

    setFeedback({
      text: isTimeOut ? "มังกรบุกสำเร็จ! ปราสาทเสียหาย" : "โจมตีพลาด! ลองใหม่อีกครั้ง",
      color: "text-red-600"
    });
    
    if (isTimeOut) {
      if (round >= 10) {
        setGameState('RESULT');
      } else {
        setRound(r => r + 1);
        generateProblem();
      }
    }
  };

  // --- ตรวจคำตอบ ---
  const checkAnswer = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (parseInt(userInput) === problem.answer) {
      setScore(s => s + 1);
      setFeedback({ text: "สุดยอด! โจมตีสำเร็จ ✨", color: "text-green-600" });
      
      if (round >= 10) {
        setTimeout(() => setGameState('RESULT'), 500);
      } else {
        setTimeout(() => {
          setRound(r => r + 1);
          generateProblem();
        }, 500);
      }
    } else {
      handleWrong(false);
    }
  };

  // --- คำนวณยศอัศวิน ---
  const getRank = (): Rank => {
    if (score === 10) return 'มหาอัศวินผู้พิทักษ์';
    if (score >= 8) return 'อัศวินมังกร';
    if (score >= 5) return 'อัศวินองครักษ์';
    return 'อัศวินฝึกหัด';
  };

  return (
    <div className={`min-h-screen p-4 flex flex-col items-center relative transition-transform duration-100 ${isShaking ? 'translate-x-2' : ''}`}>
      {/* พื้นหลังเกม */}
      <div className="game-bg" />
      
      {/* ส่วนหัวของเกม (HUD) */}
      <header className="w-full max-w-md hud-container mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Shield className="text-blue-400" size={20} />
          </div>
          <span className="font-black text-white text-lg tracking-tight uppercase">Castle Defense</span>
        </div>
        <div className="flex gap-1.5 bg-black/20 px-3 py-2 rounded-xl">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              fill={i < hp ? "#ef4444" : "none"} 
              color={i < hp ? "#ef4444" : "rgba(255,255,255,0.3)"} 
              size={22} 
              className={`transition-all duration-300 ${i < hp ? 'scale-100' : 'scale-75 opacity-50'}`} 
            />
          ))}
        </div>
      </header>

      {/* --- หน้า Lobby --- */}
      {gameState === 'LOBBY' && (
        <div className="w-full max-w-md text-center parchment-card p-8 animate-in fade-in zoom-in duration-500">
          <div className="mb-6">
            <h1 className="text-5xl font-black text-slate-800 mb-2 tracking-tighter">อัศวินสูตรคูณ</h1>
            <div className="h-1 w-24 bg-amber-800 mx-auto rounded-full opacity-30" />
          </div>
          
          <p className="text-slate-600 font-medium mb-8">เลือกแม่สูตรคูณเพื่อเริ่มภารกิจปกป้องปราสาท!</p>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <button
                key={num}
                onClick={() => startGame(num)}
                className="stone-btn p-4 font-black text-2xl"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => startGame('RANDOM')}
              className="col-span-3 wood-btn p-5 font-black text-xl mt-2 flex items-center justify-center gap-3"
            >
              🔥 โหมดสุ่มทุกแม่
            </button>
          </div>
        </div>
      )}

      {/* --- หน้า PLAYING --- */}
      {gameState === 'PLAYING' && (
        <div className="w-full max-w-md flex flex-col items-center animate-in fade-in duration-300">
          {/* Progress Bar */}
          <div className="w-full bg-black/30 rounded-full h-3 mb-8 overflow-hidden border border-white/10">
            <div className="bg-blue-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${(round / 10) * 100}%` }} />
          </div>

          {/* Battle Area */}
          <div className="battle-path mb-10">
             {/* มังกร (ตัวแทนศัตรู) */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-150 ease-linear z-20"
              style={{ right: `${dragonPos}%` }}
            >
              <div className="animate-bounce">
                <div className="text-7xl drop-shadow-2xl inline-block" style={{ transform: 'scaleX(-1)' }}>🐲</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-xl text-lg font-black border-2 border-blue-600 mt-2 text-blue-800">
                {problem.a} × {problem.b}
              </div>
            </div>
            
            {/* ปราสาท (เป้าหมาย) */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-8xl drop-shadow-2xl z-10">🏰</div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-red-500/10 pointer-events-none" />
          </div>

          {/* Input Area */}
          <div className="w-full parchment-card p-8 text-center shadow-2xl">
            <h2 className="text-6xl font-black text-slate-800 mb-8 tracking-widest problem-text">
              {problem.a} × {problem.b}
            </h2>

            <form onSubmit={checkAnswer} className="flex flex-col gap-4 w-full">
              <input
                autoFocus
                type="number"
                inputMode="numeric"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="ป้อนคำตอบ..."
                className="w-full text-3xl p-5 rounded-2xl border-4 border-slate-200 focus:border-blue-500 outline-none shadow-inner bg-white/50 text-center font-black"
              />
              <button 
                type="submit"
                className="wood-btn p-5 font-black text-2xl flex items-center justify-center gap-3 shadow-xl"
              >
                <Sword size={28} /> โจมตี!
              </button>
            </form>
            
            <div className="h-8 mt-4">
              {feedback && (
                <p className={`font-black text-lg animate-bounce ${feedback.color}`}>
                  {feedback.text}
                </p>
              )}
            </div>
            
            <div className="mt-6 flex justify-between items-center text-slate-400 font-bold text-sm uppercase tracking-widest border-t border-slate-200 pt-6">
              <span>ด่าน {round}/10</span>
              <span>คะแนน {score}</span>
            </div>
          </div>
        </div>
      )}

      {/* --- หน้า RESULT --- */}
      {gameState === 'RESULT' && (
        <div className="w-full max-w-md text-center parchment-card p-10 animate-in zoom-in duration-500">
          <div className="relative mb-8">
            <Trophy className="mx-auto text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" size={100} />
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-xl border-4 border-white shadow-lg">
              {score}
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-800 mb-2">ภารกิจเสร็จสิ้น!</h2>
          <p className="text-slate-500 mb-8 font-medium">คุณได้ปกป้องปราสาทจากการบุกรุก</p>
          
          <div className="bg-amber-100/50 border-2 border-amber-200 p-6 rounded-3xl mb-10">
            <p className="text-xs text-amber-600 uppercase tracking-[0.2em] font-black mb-2">ยศอัศวินของคุณ</p>
            <p className="text-3xl font-black text-amber-900">{getRank()}</p>
          </div>
          
          <button
            onClick={() => setGameState('LOBBY')}
            className="stone-btn w-full p-5 font-black text-xl flex items-center justify-center gap-3"
          >
            <RefreshCw size={24} /> เล่นอีกครั้ง
          </button>
        </div>
      )}
    </div>
  );
}

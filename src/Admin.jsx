import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // 통신병 불러오기
import './App.css';

function Admin() {
  const [password, setPassword] = useState(''); // 입력한 비밀번호
  const [isAuthorized, setIsAuthorized] = useState(false); // 인증 여부
  const [prayers, setPrayers] = useState([]); // 기도 제목 목록
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // 🔒 여기에 관리자 전용 비밀번호를 지정하세요!
  const ADMIN_PASSWORD = "1234"; 

  // 🔔 새 글이 왔을 때 재생할 무료 효과음 파일 URL
  const dingSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav');

  // 인증(로그인) 성공 시에만 데이터를 가져오고 실시간 감시망을 켭니다.
  useEffect(() => {
    if (!isAuthorized) return;

    fetchPrayers();

    // 🔥 [실시간 마법] 누군가 글을 쓰는 순간 페이지 새로고침 없이 바로 감지!
    const channel = supabase
      .channel('realtime-prayers')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'prayers' },
        (payload) => {
          // 1. 새 기도 제목을 목록 맨 위에 즉시 추가합니다.
          setPrayers((prev) => [payload.new, ...prev]);
          // 2. "띵동~" 알림음을 재생합니다.
          dingSound.play().catch((e) => console.log("소리 재생을 위해 화면을 한 번 클릭해 주세요:", e));
        }
      )
      .subscribe();

    // 페이지를 나갈 때는 감시망을 종료합니다.
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorized]);

  // 데이터 가져오기 함수
  const fetchPrayers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert('데이터를 가져오는데 실패했습니다: ' + error.message);
    } else {
      setPrayers(data);
    }
    setIsLoading(false);
  };

  // 🗑️ [삭제 함수] Supabase 창고와 화면에서 데이터를 지웁니다.
  const handleDelete = async (id) => {
    if (!window.confirm("이 기도 제목을 정말 삭제하시겠습니까?")) return;

    const { error } = await supabase
      .from('prayers')
      .delete()
      .eq('id', id);

    if (error) {
      alert("삭제 실패: " + error.message);
    } else {
      // 성공 시 화면 목록에서도 즉시 제외
      setPrayers((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // 비밀번호 제출 처리 함수
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert('비밀번호가 일치하지 않습니다! ❌');
      setPassword('');
    }
  };

  // 날짜 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = weekDays[date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
  };

  // ----------------------------------------------------
  // 🔐 화면 1: 비밀번호를 입력하기 전 보여줄 화면
  // ----------------------------------------------------
  if (!isAuthorized) {
    return (
      <div className="app-container" style={{ maxWidth: '400px', marginTop: '80px' }}>
        <header className="header">
          <h1>🔒 관리자 인증</h1>
          <p>비밀번호를 입력해야 들어갈 수 있습니다.</p>
        </header>
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            style={{
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e0',
              fontSize: '1.1rem',
              textAlign: 'center'
            }}
            autoFocus
          />
          <button type="submit" className="submit-btn">입장하기</button>
        </form>
      </div>
    );
  }

  // ----------------------------------------------------
  // 🔓 화면 2: 비밀번호 통과 후 보여줄 진짜 관리자 화면
  // ----------------------------------------------------
  return (
    <div className="app-container">
      <header className="header">
        <h1>🔒 관리자 페이지</h1>
        <p>새로운 기도 제목이 들어오면 실시간으로 🔔 알림음이 울립니다.</p>
      </header>

      {isLoading ? (
        <p style={{ color: '#718096', marginTop: '40px' }}>기도 제목을 불러오는 중입니다...</p>
      ) : prayers.length === 0 ? (
        <p style={{ color: '#718096', marginTop: '40px' }}>아직 들어온 기도 제목이 없습니다. 🕊️</p>
      ) : (
        <div 
          style={{ 
            textAlign: 'left', 
            marginTop: '30px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '15px',
            maxHeight: '55vh',
            overflowY: 'auto',
            paddingRight: '8px'
          }}
        >
          {prayers.map((item) => (
            <div 
              key={item.id} 
              style={{ 
                padding: '20px', 
                backgroundColor: '#f7fafc', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                position: 'relative' // 삭제 버튼 배치를 위해 추가
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#a0aec0', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                📅 {formatDate(item.created_at)}
              </span>
              <p style={{ margin: 0, color: '#2d3748', lineHeight: '1.6', whiteSpace: 'pre-wrap', paddingRight: '50px' }}>
                {item.content}
              </p>
              
              {/* 🗑️ 오른쪽 위에 작고 깔끔하게 들어가는 삭제 버튼 */}
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: '#fed7d7',
                  color: '#e53e3e',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient'; // 통신병 불러오기
import './App.css';

function Admin() {
  const [password, setPassword] = useState(''); // 입력한 비밀번호
  const [isAuthorized, setIsAuthorized] = useState(false); // 인증 여부
  const [prayers, setPrayers] = useState([]); // 기도 제목 목록
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // 🔒 여기에 관리자 전용 비밀번호를 지정하세요!
  const ADMIN_PASSWORD = "1218"; 

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
  // 🔐 화면 1: 비밀번호를 입력하기 전 보여줄 화면 (블랙 테마 + 완벽 중앙 정렬)
  // ----------------------------------------------------
  if (!isAuthorized) {
    return (
      <div style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '20px',
        position: 'fixed',
        top: 0,
        left: 0
      }}>
        <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
          <header style={{ marginBottom: '35px' }}>
            {/* ⭐️ 여기어때 잘난체 폰트 적용 및 중앙 정렬 */}
            <h1 style={{ fontFamily: "'yg-jalnan', sans-serif", fontSize: '2.4rem', color: '#ffffff', margin: '0 0 12px 0' }}>
              🔒 관리자 인증
            </h1>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '1rem' }}>비밀번호를 입력해야 들어갈 수 있습니다.</p>
          </header>
          
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #334155',
                backgroundColor: '#1e293b',
                color: '#ffffff',
                fontSize: '1.2rem',
                textAlign: 'center',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
              autoFocus
            />
            <button type="submit" style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}>
              입장하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 🔓 화면 2: 비밀번호 통과 후 보여줄 진짜 관리자 화면 (블랙 테마 + 대시보드형 중앙 정렬)
  // ----------------------------------------------------
  return (
    <div style={{
      backgroundColor: '#000000',
      color: '#ffffff',
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      padding: '60px 20px',
      position: 'absolute',
      top: 0,
      left: 0
    }}>
      <div style={{ width: '100%', maxWidth: '540px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '35px' }}>
          {/* ⭐️ 여기어때 잘난체 폰트 적용 및 중앙 정렬 */}
          <h1 style={{ fontFamily: "'yg-jalnan', sans-serif", fontSize: '2.4rem', color: '#ffffff', margin: '0 0 12px 0' }}>
            🔒 관리자 페이지
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
            새로운 기도 제목이 들어오면 실시간으로 <br />🔔 알림음이 울립니다.
          </p>
        </header>

        {isLoading ? (
          <p style={{ color: '#94a3b8', marginTop: '40px' }}>기도 제목을 불러오는 중입니다...</p>
        ) : prayers.length === 0 ? (
          <p style={{ color: '#94a3b8', marginTop: '40px' }}>아직 들어온 기도 제목이 없습니다. 🕊️</p>
        ) : (
          /* 🛠️ 왼쪽 쏠림 전면 수정: 중앙 정렬 바구니 배치 */
          <div 
            style={{ 
              width: '100%',
              marginTop: '10px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              maxHeight: '60vh',
              overflowY: 'auto',
              paddingRight: '6px'
            }}
          >
            {prayers.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  padding: '22px', 
                  backgroundColor: '#1e293b', /* 🖤 블랙 배경에 어울리는 다크 그레이 카드 */
                  borderRadius: '16px',
                  border: '1px solid #334155',
                  position: 'relative',
                  boxSizing: 'border-box'
                }}
              >
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                  📅 {formatDate(item.created_at)}
                </span>
                <p style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', paddingRight: '55px' }}>
                  {item.content}
                </p>
                
                {/* 🗑️ 오른쪽 위에 들어가는 세련된 붉은색 삭제 버튼 */}
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    position: 'absolute',
                    top: '18px',
                    right: '18px',
                    backgroundColor: '#ef444422',
                    color: '#f87171',
                    border: '1px solid #ef444444',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
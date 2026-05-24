import { useState } from 'react';
import { supabase } from './supabaseClient'; // 통신병 불러오기
import Admin from './Admin'; // 🔒 중요: 관리자 파일(Admin.jsx)을 불러옵니다!
import './App.css';

function Home() {
  // 🔒 [주소창 라우팅] 주소창 뒤에 /admin 을 치고 들어오면 Admin.jsx 컴포넌트를 즉시 통째로 보여줍니다!
  if (window.location.pathname === '/admin') {
    return <Admin />;
  }

  const [prayer, setPrayer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 전송 중인지 확인하는 상태
  const [lang, setLang] = useState('KOR'); // 🌐 영어 변환을 위한 언어 상태 추가!

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 내용이 없으면 안 보내기
    if (!prayer.trim()) return;

    setIsSubmitting(true); // 전송 시작! 버튼 비활성화

    // Supabase의 'prayers' 테이블에 우리가 적은 'content'를 넣습니다.
    const { error } = await supabase
      .from('prayers')
      .insert([{ content: prayer }]);

    if (error) {
      alert(lang === 'KOR' ? '전송에 실패했습니다: ' + error.message : 'Failed to send: ' + error.message);
    } else {
      alert(lang === 'KOR' ? '기도 제목이 안전하게 전달되었습니다. 🙏' : 'Your prayer request has been safely delivered. 🙏');
      setPrayer(''); // 입력창 비우기
    }

    setIsSubmitting(false); // 전송 끝! 버튼 다시 활성화
  };

  return (
    <div className="app-layout">
      {/* 1. 왼쪽 빈 공간 (데스크톱 화면 정중앙 정렬용 밸런스 패치) */}
      <div className="layout-side left-side"></div>

      {/* 2. 가운데 진짜 기도함 박스 구역 (줌 150% 효과를 위해 전체 치수 스케일업!) */}
      <div className="layout-main" style={{ width: '100%', maxWidth: '620px', padding: '20px' }}>
        <div className="box" style={{ padding: '40px', borderRadius: '24px' }}>
          
          {/* 🌐 다시 살아난 우측 상단 언어 선택 토글 (크기 확대) */}
          <div className="lang-toggle" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
            <span className={lang === 'KOR' ? 'active' : ''} onClick={() => setLang('KOR')}>KOR</span>
            <span style={{ margin: '0 6px', color: '#cbd5e1' }}>|</span>
            <span className={lang === 'ENG' ? 'active' : ''} onClick={() => setLang('ENG')}>ENG</span>
          </div>

          {/* 타이틀 (기존보다 훨씬 크게 확대) */}
          <h1 className="title" style={{ fontSize: '2.8rem', marginBottom: '30px', letterSpacing: '-1px' }}>
            {lang === 'KOR' ? '익명 기도함' : 'Anonymous Prayer'}
          </h1>
          
          {/* 기도 폼 구역 */}
          <form onSubmit={handleSubmit} className="form" style={{ gap: '20px' }}>
            <textarea
              className="textarea"
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              placeholder={lang === 'KOR' ? "여기에 기도 제목을 적어주세요..." : "Please write your prayer request here..."}
              required
              style={{
                fontSize: '1.3rem',    /* 글자 크기 대폭 확대 */
                padding: '20px',       /* 안쪽 여유 공간 확대 */
                minHeight: '220px',    /* 입력창 높이 확대 */
                borderRadius: '16px',
                lineHeight: '1.6'
              }}
            ></textarea>
            
            {/* 마태복음 말씀 구절 (가독성을 위해 폰트 크기 및 줄바꿈 자간 최적화) */}
            <p className="subtitle" style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#64748b', margin: '10px 0' }}>
              {lang === 'KOR' ? (
                <>
                  진실로 다시 너희에게 이르노니 너희 중에 두 사람이 땅에서 합심하여{"\n"}
                  무엇이든지 구하면 하늘에 계신 내 아버지께서 저희를 위하여 이루게 하시리라{"\n\n"}
                  <span style={{ fontWeight: 'bold' }}>[마태복음 18:19]</span>
                </>
              ) : (
                <>
                  "Again, truly I tell you that if two of you on earth agree about anything they ask for,{"\n"}
                  it will be done for them by my Father in heaven."{"\n\n"}
                  <span style={{ fontWeight: 'bold' }}>[Matthew 18:19]</span>
                </>
              )}
            </p>

            {/* 보내기 버튼 (큼직하고 누르기 쉽게 벌크업) */}
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting || !prayer.trim()}
              style={{
                padding: '20px',       /* 버튼 두께 확대 */
                fontSize: '1.3rem',    /* 버튼 글자 확대 */
                borderRadius: '16px',
                fontWeight: 'bold'
              }}
            >
              {isSubmitting 
                ? (lang === 'KOR' ? '보내는 중...' : 'Sending...') 
                : (lang === 'KOR' ? '보내기' : 'Submit')
              }
            </button>
          </form>

        </div>
      </div>

      {/* 3. 오른쪽 로고 구역 (수정본 유지 + 로고 크기도 살짝 키워 밸런스 패치) */}
      <div className="layout-side right-side">
        <div className="collab-header" style={{ transform: 'scale(1.2)', transformOrigin: 'right top' }}>
          <img src="/blue-logo.png" className="collab-logo blue" alt="Blue Logo" />
          <div className="collab-x">×</div>
          <div className="sync-logo-wrapper">
            <img src="/sync-logo.png" className="collab-logo sync" alt="Sync Logo" />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
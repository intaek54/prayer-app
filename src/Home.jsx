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
      
      {/* 1. 오른쪽 로고 구역 (화면 우측 상단에 무조건 고정되도록 변경) */}
      <div className="collab-header">
        <img src="/blue-logo.png" className="collab-logo blue" alt="Blue Logo" />
        <div className="collab-x">×</div>
        <div className="sync-logo-wrapper">
          <img src="/sync-logo.png" className="collab-logo sync" alt="Sync Logo" />
        </div>
      </div>

      {/* 2. 가운데 진짜 기도함 박스 구역 (줌 150% 효과를 위해 전체 치수 스케일업!) */}
      <div className="layout-main">
        <div className="box">
          
          {/* 🌐 다시 살아난 우측 상단 언어 선택 토글 (크기 확대) */}
          <div className="lang-toggle">
            <span className={lang === 'KOR' ? 'active' : ''} onClick={() => setLang('KOR')}>KOR</span>
            <span style={{ margin: '0 6px', color: '#cbd5e1' }}>|</span>
            <span className={lang === 'ENG' ? 'active' : ''} onClick={() => setLang('ENG')}>ENG</span>
          </div>

          {/* 타이틀 */}
          <h1 className="title">
            {lang === 'KOR' ? '익명 기도함' : 'Anonymous Prayer'}
          </h1>
          
          {/* 기도 폼 구역 */}
          <form onSubmit={handleSubmit} className="form">
            <textarea
              className="textarea"
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              placeholder={lang === 'KOR' ? "여기에 기도 제목을 적어주세요..." : "Please write your prayer request here..."}
              required
            ></textarea>
            
            {/* 마태복음 말씀 구절 */}
            <p className="subtitle">
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

            {/* 보내기 버튼 */}
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting || !prayer.trim()}
            >
              {isSubmitting 
                ? (lang === 'KOR' ? '보내는 중...' : 'Sending...') 
                : (lang === 'KOR' ? '보내기' : 'Submit')
              }
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}

export default Home;
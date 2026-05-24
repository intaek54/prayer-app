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

      {/* 2. 가운데 진짜 기도함 박스 구역 */}
      <div className="layout-main">
        <div className="box">
          
          {/* 🌐 다시 살아난 우측 상단 언어 선택 토글 */}
          <div className="lang-toggle">
            <span className={lang === 'KOR' ? 'active' : ''} onClick={() => setLang('KOR')}>KOR</span>
            <span style={{ margin: '0 4px', color: '#cbd5e1' }}>|</span>
            <span className={lang === 'ENG' ? 'active' : ''} onClick={() => setLang('ENG')}>ENG</span>
          </div>

          {/* 타이틀 (언어 변환 대응) */}
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
            
            {/* 마태복음 말씀 구절 (언어 변환 대응 및 줄바꿈 유지) */}
            <p className="subtitle">
              {lang === 'KOR' ? (
                <>
                  진실로 다시 너희에게 이르노니 너희 중에 두 사람이 땅에서 합심하여{"\n"}
                  무엇이든지 구하면 하늘에 계신 내 아버지께서 저희를 위하여 이루게 하시리라{"\n\n"}
                  [마태복음 18:19]
                </>
              ) : (
                <>
                  "Again, truly I tell you that if two of you on earth agree about anything they ask for,{"\n"}
                  it will be done for them by my Father in heaven."{"\n\n"}
                  [Matthew 18:19]
                </>
              )}
            </p>

            {/* 보내기 버튼 (전송 상태 + 언어 변환 완벽 대응) */}
            <button type="submit" className="submit-btn" disabled={isSubmitting || !prayer.trim()}>
              {isSubmitting 
                ? (lang === 'KOR' ? '보내는 중...' : 'Sending...') 
                : (lang === 'KOR' ? '보내기' : 'Submit')
              }
            </button>
          </form>

        </div>
      </div>

      {/* 3. 오른쪽 로고 구역 (실제 퍼블릭 폴더 내 파일명과 완벽 매칭!) */}
      <div className="layout-side right-side">
        <div className="collab-header">
          {/* 🛠️ 실제 파일명인 blue-logo.png 로 수정했습니다. */}
          <img src="/blue-logo.png" className="collab-logo blue" alt="Blue Logo" />
          <div className="collab-x">×</div>
          <div className="sync-logo-wrapper">
            {/* 🛠️ 실제 파일명인 sync-logo.png 로 수정했습니다. */}
            <img src="/sync-logo.png" className="collab-logo sync" alt="Sync Logo" />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
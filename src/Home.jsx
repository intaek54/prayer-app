import React, { useState } from 'react';
import { supabase } from './supabaseClient'; 
import './App.css'; 

const textData = {
  KR: {
    title: '익명 기도함',
    subtitle: '진실로 다시 너희에게 이르노니 너희 중에 두 사람이 땅에서 합심하여 무엇이든지 구하면 하늘에 계신 내 아버지께서 저희를 위하여 이루게 하시리라\n\n[마태복음 18:19]',
    placeholder: '여기에 기도 제목을 적어주세요...',
    sending: '보내는 중...',
    send: '보내기',
    alertEmpty: '기도 제목을 입력해주세요.',
    alertSuccess: '기도 제목이 무사히 전달되었습니다. 🙏',
    alertFail: '전송에 실패했습니다: '
  },
  EN: {
    title: 'Prayer Box',
    subtitle: 'Again, truly I tell you that if two of you on earth agree about anything they ask for, it will be done for them by my Father in heaven.\n\n[Matthew 18:19]',
    placeholder: 'Write your prayer request here...',
    sending: 'Sending...',
    send: 'Submit',
    alertEmpty: 'Please enter your prayer request.',
    alertSuccess: 'Your prayer request has been safely delivered. 🙏',
    alertFail: 'Failed to send: '
  }
};

function Home() {
  const [prayer, setPrayer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [lang, setLang] = useState('KR'); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prayer.trim()) {
      alert(textData[lang].alertEmpty);
      return;
    }

    setIsSubmitting(true); 

    const { error } = await supabase
      .from('prayers')
      .insert([{ content: prayer }]);

    if (error) {
      alert(textData[lang].alertFail + error.message);
    } else {
      alert(textData[lang].alertSuccess);
      setPrayer(''); 
    }

    setIsSubmitting(false); 
  };

  return (
    <div className="app-layout">
      {/* 1. 왼쪽 여백 영역 */}
      <div className="layout-side left-side"></div>

      {/* 2. 중간 메인 기도함 영역 */}
      <div className="layout-main">
        <div className="box">
          <div className="lang-toggle">
            <span 
              className={lang === 'KR' ? 'active' : ''} 
              onClick={() => setLang('KR')}
            >
              KOR
            </span>
            {' | '}
            <span 
              className={lang === 'EN' ? 'active' : ''} 
              onClick={() => setLang('EN')}
            >
              ENG
            </span>
          </div>

          <h1 className="title">{textData[lang].title}</h1>

          <form onSubmit={handleSubmit} className="form">
            <textarea
              className="textarea"
              placeholder={textData[lang].placeholder}
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              required
            />
            {/* 🌟 이상한 박스를 없애고 중앙 정렬을 먹이기 위해 구조를 유지하되 CSS로 정돈 */}
            <p className="subtitle">{textData[lang].subtitle}</p>
            
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? textData[lang].sending : textData[lang].send}
            </button>
          </form>
        </div>
      </div>

      {/* 3. 오른쪽 로고 영역 */}
      <div className="layout-side right-side">
        <div className="collab-header">
          <img src="/blue-logo.png" alt="Blue Logo" className="collab-logo blue" />
          <span className="collab-x">×</span>
          {/* 🌟 Sync 로고를 가두고 키우는 완벽한 가림막 상자 */}
          <div className="sync-logo-wrapper">
            <img src="/sync-logo.png" alt="Sync Logo" className="collab-logo sync" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { PhoneCall, PhoneOff, Volume2 } from 'lucide-react';
import { sounds } from '../../utils/audioChimes';

export const KeypadPhoneSimulator: React.FC = () => {
  const {
    farmers,
    selectedFarmerId,
    poolContributors,
    farmerAccept,
    farmerReject,
    farmerCounterOffer,
    fleet
  } = useDemo();

  const farmer = farmers.find((f) => f.id === selectedFarmerId) || farmers[1];

  const [callState, setCallState] = useState<'RINGING' | 'IN_CALL' | 'ENDED' | 'IDLE'>('RINGING');
  const [ivrScript, setIvrScript] = useState<string>('');
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const isDelivered = fleet.deliveryStatus === 'DELIVERED';
  const contributor = poolContributors.find((c) => c.farmerId === farmer.id);
  const allocatedQty = contributor ? contributor.allocatedQty : farmer.todayAvailableQty;
  const totalPayout = allocatedQty * farmer.offeredRate;

  const isGujarati = farmer.preferredLanguage === 'Gujarati';

  // Crop translations without English words
  const cropHindiMap: Record<string, string> = {
    Tomato: 'टमाटर',
    Potato: 'आलू',
    Onion: 'प्याज',
    Cabbage: 'पत्तागोभी',
    Cauliflower: 'फूलगोभी'
  };

  const cropGujaratiMap: Record<string, string> = {
    Tomato: 'ટામેટાં',
    Potato: 'બટાકા',
    Onion: 'ડુંગળી',
    Cabbage: 'કોબીજ',
    Cauliflower: 'ફૂલકોબી'
  };

  const cropNameLocalized = isGujarati
    ? cropGujaratiMap[farmer.todayCrop] || farmer.todayCrop
    : cropHindiMap[farmer.todayCrop] || farmer.todayCrop;

  const farmerFirstName = farmer.name.split(' ')[0];

  // Pure vernacular IVR text without ANY English words
  const getIvrMessage = () => {
    if (isGujarati) {
      return {
        greeting: `નમસ્તે ${farmerFirstName}ભાઈ. મિટ્ટી ટુ માર્કેટમાં આપનું સ્વાગત છે.`,
        body: `આપની પાસે ${allocatedQty} કિલોગ્રામ ${cropNameLocalized} ઉપલબ્ધ છે. થોક વેપારીએ પ્રતિ કિલોગ્રામ ${farmer.offeredRate} રૂપિયાનો ખરીદ ભાવ પ્રસ્તાવ મૂક્યો છે. વાહન સવારે ચાર વાગ્યે આપના ખેતરે આવશે.`,
        options: `આ ખરીદ ભાવ સ્વીકારવા માટે એક દબાવો. અસ્વીકાર કરવા બે દબાવો. પોતાનો નવો ભાવ આપવા ત્રણ દબાવો.`
      };
    } else {
      return {
        greeting: `नमस्ते ${farmerFirstName} जी। मिट्टी टू मार्केट में आपका स्वागत है।`,
        body: `आपके पास ${allocatedQty} किलोग्राम ${cropNameLocalized} उपलब्ध है। थोक क्रेता ने प्रति किलोग्राम ${farmer.offeredRate} रुपये का खरीद भाव प्रस्तावित किया है। माल का उठाव सुबह चार बजे आपके खेत से होगा।`,
        options: `यह खरीद भाव स्वीकार करने के लिए एक दबाएं। अस्वीकार करने के लिए दो दबाएं। अपना नया भाव बताने के लिए तीन दबाएं।`
      };
    }
  };

  // Ring and state reset when farmer changes
  useEffect(() => {
    if (farmer.status === 'Pending') {
      setCallState('RINGING');
      sounds.playKeypadRing();
    } else {
      setCallState('IDLE');
    }
  }, [farmer.id, farmer.status]);

  // SMS audio tone upon final delivery payment credit
  useEffect(() => {
    if (isDelivered && farmer.status === 'Accepted') {
      sounds.playNotificationChime();
    }
  }, [isDelivered, farmer.status]);

  const handleAnswerCall = () => {
    setCallState('IN_CALL');
    const msg = getIvrMessage();
    const fullText = `${msg.greeting} ${msg.body} ${msg.options}`;
    setIvrScript(fullText);

    // Browser speech synthesis in pure Hindi or Gujarati
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.lang = isGujarati ? 'gu-IN' : 'hi-IN';
        utterance.rate = 0.88; // clear, natural speed for rural comprehension

        const voices = window.speechSynthesis.getVoices();
        const targetVoice = voices.find((v) =>
          isGujarati
            ? v.lang.startsWith('gu') || v.name.includes('Gujarati')
            : v.lang.startsWith('hi') || v.name.includes('Hindi')
        );
        if (targetVoice) {
          utterance.voice = targetVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  };

  const handlePressKey = (key: string) => {
    sounds.playKeyBeep();
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 300);

    if (callState !== 'IN_CALL') return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (key === '1') {
      // 1: स्वीकार
      farmerAccept(farmer.id);
      setCallState('ENDED');
    } else if (key === '2') {
      // 2: अस्वीकार
      farmerReject(farmer.id, 'ध्वनि कॉल के माध्यम से किसान द्वारा प्रस्ताव अस्वीकृत');
      setCallState('ENDED');
    } else if (key === '3') {
      // 3: नया भाव
      farmerCounterOffer(farmer.id, farmer.offeredRate + 1);
      setCallState('ENDED');
    }
  };

  return (
    <div className="flex justify-center p-2">
      {/* Retro Keypad Feature Phone Body */}
      <div className="w-full max-w-[320px] bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 rounded-[48px] p-4 shadow-2xl border-4 border-stone-700 relative text-white flex flex-col justify-between items-center space-y-4">
        {/* Top Speaker Grille */}
        <div className="flex items-center gap-1.5 pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-stone-600"></div>
          <div className="w-8 h-1.5 rounded-full bg-stone-600"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-stone-600"></div>
        </div>

        {/* Nostalgic Monochrome LCD Screen */}
        <div className="w-full bg-[#9dae87] text-[#1e2a14] rounded-2xl p-3 border-4 border-[#788864] font-mono shadow-inner min-h-[210px] flex flex-col justify-between text-xs">
          {/* LCD Top Status */}
          <div className="flex justify-between items-center text-[10px] font-bold border-b border-[#788864]/50 pb-1">
            <span>{isGujarati ? 'બી.એસ.એન.એલ' : 'भारत संचार'}</span>
            <span>०४:१२</span>
            <span>[||||]</span>
          </div>

          {/* LCD Center Display */}
          <div className="flex-1 py-2 text-center flex flex-col justify-center space-y-1.5">
            {isDelivered && farmer.status === 'Accepted' ? (
              <div className="space-y-1 animate-in fade-in">
                <div className="font-extrabold uppercase text-[11px] text-amber-950">
                  {isGujarati ? '[ 📩 નવો સંદેશ ]' : '[ 📩 नया संदेश ]'}
                </div>
                <div className="font-bold text-xs">मिट्टी टू मार्केट:</div>
                <div className="text-[11px] leading-snug font-semibold">
                  {isGujarati
                    ? `અભિનંદન! આપના બેંક ખાતામાં બાકી ૩૦% રકમ સહિત કુલ ₹${totalPayout.toLocaleString('en-IN')} જમા થઈ ગઈ છે. ૧૦૦% ચૂકવણી સફળ. સંદર્ભ #MM1024.`
                    : `बधाई हो! आपके बैंक खाते में अंतिम ३०% राशि सहित कुल ₹${totalPayout.toLocaleString('en-IN')} जमा कर दी गई है। १००% भुगतान सफल। संदर्भ #MM1024.`}
                </div>
                <div className="text-[9px] text-[#2d3e1d] pt-0.5 border-t border-[#788864]/50">
                  {isGujarati ? 'સંપૂર્ણ ચૂકવણી સંપન્ન' : 'पूर्ण भुगतान सफल'}
                </div>
              </div>
            ) : farmer.status === 'Accepted' ? (
              <div className="space-y-1">
                <div className="font-extrabold text-sm">
                  {isGujarati ? '✓ ભાવ પ્રસ્તાવ સ્વીકૃત' : '✓ खरीद भाव स्वीकृत'}
                </div>
                <div className="text-[11px]">
                  {isGujarati ? 'સવારે ૪:૦૦ વાગ્યે વાહન આવશે.' : 'सुबह ४:०० बजे वाहन आगमन निर्धारित।'}
                </div>
                <div className="text-[10px]">
                  {isGujarati ? '૭૦% અનામત રકમ જમા છે.' : '७०% अग्रिम राशि सुरक्षित रखी गई है।'}
                </div>
              </div>
            ) : farmer.status === 'Rejected' ? (
              <div className="space-y-1">
                <div className="font-extrabold text-sm">
                  {isGujarati ? '✕ કૉલ સમાપ્ત' : '✕ कॉल समाप्त'}
                </div>
                <div className="text-[11px]">
                  {isGujarati ? 'પ્રસ્તાવ અસ્વીકૃત. અનામત ખેડૂતને સોંપાયેલ.' : 'प्रस्ताव अस्वीकृत। वैकल्पिक किसान को आवंटित।'}
                </div>
              </div>
            ) : callState === 'RINGING' ? (
              <div className="space-y-1">
                <div className="text-[10px] font-bold animate-pulse text-rose-900">
                  {isGujarati ? '🔔 ઘંટડી વાગી રહી છે... (ટ્રિંગ ટ્રિંગ)' : '🔔 घंटी बज रही है... (ट्रिंग ट्रिंग)'}
                </div>
                <div className="font-extrabold text-sm uppercase">
                  {isGujarati ? 'નવો આવક કૉલ' : 'नया आगमन कॉल'}
                </div>
                <div className="font-bold text-xs">मिट्टी टू मार्केट कृषि खरीद</div>
                <div className="text-[10px]">
                  {farmer.village} {isGujarati ? 'સંકલન કેન્દ્ર' : 'संकलन केंद्र'}
                </div>
              </div>
            ) : (
              /* In-Call Pure Hindi / Gujarati IVR */
              <div className="text-left text-[11px] space-y-1 overflow-y-auto max-h-[125px] leading-snug">
                <div className="font-bold uppercase text-[9px] text-stone-700 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-emerald-800 animate-pulse" />
                  <span>{isGujarati ? 'ધ્વનિ સંદેશ (આઈ.વી.આર)' : 'कृषि ध्वनि संदेश (आईवीआर)'}</span>
                </div>
                <p className="font-semibold leading-relaxed">
                  {ivrScript || getIvrMessage().body}
                </p>
                <div className="p-1 rounded bg-[#879772] text-[#1e2a14] font-bold text-[10px] mt-1 text-center">
                  {isGujarati
                    ? 'બટન દબાવો: [૧] સ્વીકાર • [૨] અસ્વીકાર • [૩] નવો ભાવ'
                    : 'बटन दबाएं: [१] स्वीकार • [२] अस्वीकार • [३] नया भाव'}
                </div>
              </div>
            )}
          </div>

          {/* LCD Softkeys */}
          <div className="flex justify-between items-center text-[10px] font-bold pt-1 border-t border-[#788864]/50">
            {callState === 'RINGING' ? (
              <>
                <span className="text-emerald-900">{isGujarati ? 'જવાબ આપો' : 'उत्तर दें'}</span>
                <span className="text-rose-900">{isGujarati ? 'કાપો' : 'काटें'}</span>
              </>
            ) : callState === 'IN_CALL' ? (
              <>
                <span className="text-emerald-900">{isGujarati ? 'મૌન' : 'मौन'}</span>
                <span className="text-rose-900">{isGujarati ? 'સમાપ્ત' : 'समाप्त'}</span>
              </>
            ) : (
              <>
                <span>{isGujarati ? 'મેનૂ' : 'सूची'}</span>
                <span>{isGujarati ? 'પાછા' : 'वापस'}</span>
              </>
            )}
          </div>
        </div>

        {/* Answer / Hangup Physical Call Buttons */}
        <div className="w-full flex justify-between items-center px-4 pt-1">
          <button
            onClick={handleAnswerCall}
            disabled={callState === 'IN_CALL' || farmer.status !== 'Pending'}
            className="w-16 h-10 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white flex flex-col items-center justify-center shadow-md cursor-pointer transition disabled:opacity-50"
            title={isGujarati ? 'કૉલ ઉપાડો' : 'कॉल उठाएं'}
          >
            <PhoneCall className="w-4 h-4" />
            <span className="text-[8px] font-bold mt-0.5">{isGujarati ? 'ઉપાડો' : 'उठाएं'}</span>
          </button>

          <div className="w-9 h-9 rounded-full bg-stone-700 border-2 border-stone-600 flex items-center justify-center text-[10px] font-bold font-mono">
            {isGujarati ? 'હા' : 'हाँ'}
          </div>

          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              setCallState('ENDED');
              farmerReject(farmer.id, isGujarati ? 'કૉલ સમાપ્ત કરી નકારવામાં આવ્યો' : 'कॉल काटकर प्रस्ताव अस्वीकृत किया गया');
            }}
            className="w-16 h-10 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white flex flex-col items-center justify-center shadow-md cursor-pointer transition"
            title={isGujarati ? 'કૉલ કાપો' : 'कॉल काटें'}
          >
            <PhoneOff className="w-4 h-4" />
            <span className="text-[8px] font-bold mt-0.5">{isGujarati ? 'કાપો' : 'काटें'}</span>
          </button>
        </div>

        {/* Physical 3x4 Numeric Keypad with Pure Vernacular Labels */}
        <div className="w-full grid grid-cols-3 gap-2 px-3 pb-2 font-mono">
          {[
            { num: '1', devanagari: isGujarati ? '૧' : '१', sub: isGujarati ? 'સ્વીકાર' : 'स्वीकार', isAction: true },
            { num: '2', devanagari: isGujarati ? '૨' : '२', sub: isGujarati ? 'અસ્વીકાર' : 'अस्वीकार', isAction: true },
            { num: '3', devanagari: isGujarati ? '૩' : '३', sub: isGujarati ? 'નવો ભાવ' : 'नया भाव', isAction: true },
            { num: '4', devanagari: isGujarati ? '૪' : '४', sub: isGujarati ? 'કખગ' : 'कखग' },
            { num: '5', devanagari: isGujarati ? '૫' : '५', sub: isGujarati ? 'ચછજ' : 'चछज' },
            { num: '6', devanagari: isGujarati ? '૬' : '६', sub: isGujarati ? 'ટઠડ' : 'टठड' },
            { num: '7', devanagari: isGujarati ? '૭' : '७', sub: isGujarati ? 'તથદ' : 'तथद' },
            { num: '8', devanagari: isGujarati ? '૮' : '८', sub: isGujarati ? 'પફબ' : 'पफब' },
            { num: '9', devanagari: isGujarati ? '૯' : '९', sub: isGujarati ? 'યરલ' : 'यरल' },
            { num: '*', devanagari: '*', sub: ' ' },
            { num: '0', devanagari: isGujarati ? '૦' : '०', sub: '+' },
            { num: '#', devanagari: '#', sub: ' ' }
          ].map((key) => (
            <button
              key={key.num}
              onClick={() => handlePressKey(key.num)}
              className={`py-2 px-1 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 border border-stone-700 shadow-sm flex flex-col items-center justify-center transition cursor-pointer ${
                activeKey === key.num ? 'bg-amber-600 text-white ring-2 ring-amber-400' : ''
              } ${
                key.num === '1' && callState === 'IN_CALL'
                  ? 'border-emerald-500/80 animate-pulse text-emerald-300 font-extrabold'
                  : ''
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-sm font-extrabold leading-none">{key.devanagari}</span>
                <span className="text-[10px] text-stone-400 font-normal">({key.num})</span>
              </div>
              <span className={`text-[8px] font-bold mt-0.5 ${key.isAction ? 'text-amber-300 font-extrabold' : 'text-stone-400'}`}>
                {key.sub}
              </span>
            </button>
          ))}
        </div>

        <div className="text-[10px] text-stone-400 font-mono tracking-wider">
          {isGujarati ? 'મિટ્ટી ટુ માર્કેટ • ગ્રામીણ કૉલ' : 'मिट्टी टू मार्केट • ग्रामीण आईवीआर'}
        </div>
      </div>
    </div>
  );
};

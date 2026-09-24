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
      farmerReject(
        farmer.id,
        isGujarati
          ? 'બટન ૨ દબાવી અસ્વીકાર કર્યો (કૉલ કટ)'
          : 'बटन २ दबाकर प्रस्ताव अस्वीकृत किया (कॉल कट)'
      );
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
              <div className="space-y-1.5 p-2 bg-[#8da076] rounded-xl border border-[#6b7b58] animate-in fade-in">
                <div className="font-extrabold text-sm flex items-center justify-center gap-1 text-[#15230c]">
                  <span>✓</span>
                  <span>{isGujarati ? 'ભાવ પ્રસ્તાવ સ્વીકૃત' : 'खरीद भाव स्वीकृत'}</span>
                </div>
                <div className="text-[11px] font-bold text-[#1e2a14]">
                  {isGujarati
                    ? `જથ્થો: ${allocatedQty} કિલો • ભાવ: ₹${farmer.offeredRate}/કિલો`
                    : `मात्रा: ${allocatedQty} किग्रा • भाव: ₹${farmer.offeredRate}/किग्रा`}
                </div>
                <div className="text-[10px] text-[#2c3d1b] leading-tight">
                  {isGujarati
                    ? 'સવારે ૪:૦૦ વાગ્યે વાહન આપના ખેતરે આવશે. ૭૦% રકમ અનામત ખાતામાં સુરક્ષિત છે.'
                    : 'सुबह ४:०० बजे वाहन आपके खेत पर पहुंचेगा। ७०% अग्रिम राशि सुरक्षित रखी गई है।'}
                </div>
                <div className="pt-1 border-t border-[#788864] flex items-center justify-between text-[9px] font-bold text-emerald-950">
                  <span>{isGujarati ? 'ઓર્ડર સમન્વય પૂર્ણ' : 'आदेश समेकन पूर्ण'}</span>
                  <span>[૧૦૦% નિશ્ચિત]</span>
                </div>
              </div>
            ) : farmer.status === 'Rejected' ? (
              <div className="space-y-1.5 p-2 bg-[#b5a38a] rounded-xl border border-[#8a7761] text-[#331c12] animate-in fade-in">
                <div className="font-extrabold text-sm flex items-center justify-center gap-1 text-rose-950">
                  <span>✕</span>
                  <span>{isGujarati ? 'પ્રસ્તાવ અસ્વીકૃત' : 'प्रस्ताव अस्वीकृत'}</span>
                </div>
                <div className="text-[10px] leading-tight font-semibold">
                  {isGujarati
                    ? 'આપે આ ભાવ નકાર્યો છે. સિસ્ટમે અનામત ખેડૂતને આ જથ્થો સોંપી દીધો છે.'
                    : 'आपने यह भाव अस्वीकार किया। सिस्टम ने वैकल्पिक किसान को मांग आवंटित कर दी है।'}
                </div>
                <div className="pt-1 border-t border-[#8a7761]/60 text-[9px] font-bold">
                  {isGujarati ? 'કૉલ સમાપ્ત • સ્ટેન્ડબાય સક્રિય' : 'कॉल समाप्त • स्टैंडबाय सक्रिय'}
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

        {/* Answer / Hangup / D-Pad Control Key Bar */}
        <div className="w-full grid grid-cols-3 gap-2 px-3 pt-1 items-center">
          {/* Green Call Button */}
          <button
            onClick={handleAnswerCall}
            disabled={callState === 'IN_CALL' || farmer.status !== 'Pending'}
            className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg border border-emerald-400 cursor-pointer transition disabled:opacity-40"
            title="Answer Call (हरा बटन)"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-0.5 tracking-wider font-mono">CALL</span>
          </button>

          {/* Center Navi / OK D-Pad */}
          <div className="h-11 rounded-xl bg-stone-800 border-2 border-stone-600 flex items-center justify-center shadow-inner">
            <button
              onClick={() => {
                if (callState === 'RINGING') handleAnswerCall();
                else if (callState === 'IN_CALL') handlePressKey('1');
              }}
              className="w-8 h-8 rounded-lg bg-stone-700 hover:bg-stone-600 active:scale-95 border border-stone-500 flex items-center justify-center text-[10px] font-extrabold text-stone-200 cursor-pointer shadow-xs"
            >
              OK
            </button>
          </div>

          {/* Red End / Power Button */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              setCallState('ENDED');
              farmerReject(farmer.id, isGujarati ? 'કૉલ સમાપ્ત કરી નકારવામાં આવ્યો' : 'कॉल काटकर प्रस्ताव अस्वीकृत किया गया');
            }}
            className="h-11 rounded-xl bg-rose-700 hover:bg-rose-600 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg border border-rose-500 cursor-pointer transition"
            title="End Call / Reject (लाल बटन)"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-0.5 tracking-wider font-mono">END</span>
          </button>
        </div>

        {/* Standard Physical 3x4 Alphanumeric Keypad */}
        <div className="w-full grid grid-cols-3 gap-2 px-3 pb-2 font-mono">
          {[
            { num: '1', letters: '.,@', isIvrChoice: true },
            { num: '2', letters: 'abc', isIvrChoice: true },
            { num: '3', letters: 'def', isIvrChoice: true },
            { num: '4', letters: 'ghi' },
            { num: '5', letters: 'jkl' },
            { num: '6', letters: 'mno' },
            { num: '7', letters: 'pqrs' },
            { num: '8', letters: 'tuv' },
            { num: '9', letters: 'wxyz' },
            { num: '*', letters: '+' },
            { num: '0', letters: '␣' },
            { num: '#', letters: '⇧' }
          ].map((key) => {
            const isHighlighted = callState === 'IN_CALL' && key.isIvrChoice;

            return (
              <button
                key={key.num}
                onClick={() => handlePressKey(key.num)}
                className={`py-2 px-1 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-200 border border-stone-600/80 shadow-md flex flex-col items-center justify-center transition cursor-pointer ${
                  activeKey === key.num ? 'bg-amber-600 text-white ring-2 ring-amber-400' : ''
                } ${
                  isHighlighted ? 'border-amber-400 ring-2 ring-amber-400/40 text-amber-200' : ''
                }`}
              >
                <span className="text-base font-extrabold leading-none text-white">
                  {key.num}
                </span>
                <span className="text-[8px] text-stone-400 uppercase tracking-widest mt-0.5">
                  {key.letters}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom Feature Phone Brand Tag */}
        <div className="text-[9px] text-stone-400 font-mono tracking-widest uppercase">
          Mitti2Market • Rural IVR Telecom Terminal
        </div>
      </div>
    </div>
  );
};

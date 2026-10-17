'use strict';
const GEO=window.__EOS_DATA.GEO;
const N=GEO.regions;
const F=[
{name:'Англия',color:'#bd6455',capital:'Лондон',style:'Морская торговля',trait:'merchant'},
{name:'Франция',color:'#527db0',capital:'Париж',style:'Королевская армия',trait:'army'},
{name:'Испания',color:'#c1a15b',capital:'Мадрид',style:'Обширные владения',trait:'trade'},
{name:'Португалия',color:'#72b0a2',capital:'Лиссабон',style:'Атлантические маршруты',trait:'merchant'},
{name:'Нидерланды',color:'#e0a167',capital:'Амстердам',style:'Купеческая республика',trait:'merchant'},
{name:'Габсбурги',color:'#a9a5c2',capital:'Вена',style:'Династическая дипломатия',trait:'fort'},
{name:'Бранденбург-Пруссия',color:'#9d9290',capital:'Берлин',style:'Полковая дисциплина',trait:'army'},
{name:'Речь Посполитая',color:'#b76d82',capital:'Варшава',style:'Конница и магнаты',trait:'cavalry'},
{name:'Швеция',color:'#5e94c6',capital:'Стокгольм',style:'Балтийские верфи',trait:'navy'},
{name:'Дания-Норвегия',color:'#c77574',capital:'Копенгаген',style:'Проливы и торговля',trait:'navy'},
{name:'Россия',color:'#709e76',capital:'Москва',style:'Военная модернизация',trait:'army'},
{name:'Османская империя',color:'#7fa06b',capital:'Константинополь',style:'Военные провинции',trait:'trade'},
{name:'Венеция',color:'#9bc1a2',capital:'Венеция',style:'Адриатическая держава',trait:'navy'},
{name:'Савойя',color:'#aa89ad',capital:'Турин',style:'Альпийские крепости',trait:'fort'},
{name:'Шотландия',color:'#b27870',capital:'Эдинбург',style:'Горные кланы',trait:'fort'},
{name:'Германские княжества',color:'#bb9b79',capital:'Бавария',style:'Княжеские армии',trait:'trade'},
{name:'Саксония',color:'#ab85a9',capital:'Саксония',style:'Горные ремёсла',trait:'trade'},
{name:'Итальянские государства',color:'#d4a578',capital:'Рим',style:'Итальянские города',trait:'merchant'},
{name:'Марокко',color:'#b28465',capital:'Рабат',style:'Магрибские караваны',trait:'trade'},
{name:'Алжир',color:'#91aa82',capital:'Алжир',style:'Средиземноморские гавани',trait:'navy'}
];
const TECH=[
{id:'agriculture',name:'Трёхпольный севооборот',cat:'Хозяйство',cost:90,time:3,req:[],desc:'Фермы дают больше продовольствия.'},
{id:'grainstore',name:'Амбары и хранение зерна',cat:'Хозяйство',cost:95,time:3,req:['agriculture'],desc:'Меньше потерь запасов при хранении.'},
{id:'manufactory',name:'Мануфактурная организация',cat:'Хозяйство',cost:120,time:4,req:[],desc:'Мануфактуры приносят больше золота и железа.'},
{id:'banking',name:'Векселя и государственный кредит',cat:'Хозяйство',cost:140,time:4,req:['manufactory'],desc:'Больше доход от рынков и торговли.'},
{id:'roads',name:'Шоссейные дороги и мосты',cat:'Логистика',cost:95,time:3,req:[],desc:'Бонус к маршам, снабжению и торговле.'},
{id:'magazine',name:'Армейские магазины',cat:'Логистика',cost:110,time:4,req:['roads'],desc:'Меньше расходов на снабжение в походе.'},
{id:'logistics',name:'Штабное снабжение',cat:'Логистика',cost:150,time:5,req:['magazine'],desc:'Уменьшает армейский расход продовольствия.'},
{id:'drill',name:'Полковой строевой устав',cat:'Сухопутная война',cost:100,time:3,req:[],desc:'Повышает эффективность пехоты.'},
{id:'flintlock',name:'Кремнёвые мушкеты',cat:'Сухопутная война',cost:135,time:4,req:['drill'],desc:'Повышает эффективность огня пехоты.'},
{id:'bayonets',name:'Втульчатый штык',cat:'Сухопутная война',cost:150,time:4,req:['flintlock'],desc:'Повышает атаку пехоты.'},
{id:'artillery',name:'Калибры и артиллерийский парк',cat:'Сухопутная война',cost:125,time:4,req:['drill'],desc:'Повышает мощь артиллерии.'},
{id:'siege',name:'Инженерные и осадные школы',cat:'Сухопутная война',cost:145,time:4,req:['artillery'],desc:'Ослабляет преимущество вражеских фортов.'},
{id:'cavalry',name:'Кавалерийские уставы',cat:'Сухопутная война',cost:100,time:3,req:[],desc:'Усиливает конницу на равнинах.'},
{id:'shipyards',name:'Стандарты корабельных верфей',cat:'Флот',cost:120,time:4,req:[],desc:'Удешевляет строительство кораблей.'},
{id:'rigging',name:'Такелаж и парусность',cat:'Флот',cost:120,time:4,req:['shipyards'],desc:'Бонус к маневрированию флота.'},
{id:'gunnery',name:'Корабельная артиллерия',cat:'Флот',cost:145,time:5,req:['shipyards'],desc:'Усиливает линейные корабли.'},
{id:'signals',name:'Флажные сигналы эскадр',cat:'Флот',cost:160,time:5,req:['rigging'],desc:'Повышает эффективность всего флота.'},
{id:'navigation',name:'Астрономическая навигация',cat:'Флот',cost:155,time:5,req:['rigging'],desc:'Увеличивает дальность морских операций.'},
{id:'academies',name:'Академии и научные общества',cat:'Управление',cost:130,time:4,req:[],desc:'Исследования завершаются быстрее.'},
{id:'cadastre',name:'Кадастр и перепись земель',cat:'Управление',cost:120,time:4,req:[],desc:'Повышает налоговые поступления.'},
{id:'diplomacy',name:'Постоянные посольства',cat:'Управление',cost:125,time:4,req:[],desc:'Дипломатические инициативы дешевле.'},
{id:'civilservice',name:'Коллегии и гражданская служба',cat:'Управление',cost:160,time:5,req:['cadastre'],desc:'Уменьшает беспорядки и повышает стабильность.'},
{id:'trade',name:'Торговые компании',cat:'Морская торговля',cost:125,time:4,req:[],desc:'Повышает доход от морских экспедиций.'},
{id:'insurance',name:'Морское страхование',cat:'Морская торговля',cost:145,time:4,req:['trade','banking'],desc:'Повышает доход от торговых договоров.'}
];
const TECHNOLOGY_EXPANSION=[
['infantry_forms','Пехотные формирования','Профессиональная полковая система',['drill'],'Увеличивает организацию и оборону пехоты.',3,120],
['militia','Пехотные формирования','Земское ополчение',['drill'],'Открывает дешёвые ополченческие полки.',2,85],
['lineinf','Пехотные формирования','Линейная пехота',['flintlock','infantry_forms'],'Открывает линейные полки.',3,145],
['fusiliers','Пехотные формирования','Фузилёрные батальоны',['lineinf'],'Открывает фузилёров с улучшенной огневой подготовкой.',4,165],
['grenadiers','Пехотные формирования','Гренадерские роты',['bayonets','lineinf'],'Открывает гренадеров, сильных в штурме.',4,175],
['guards','Пехотные формирования','Гвардейский корпус',['grenadiers','professional_army'],'Открывает элитную гвардию с высокой организацией.',6,235],
['lightinf','Пехотные формирования','Лёгкая пехота и егеря',['lineinf'],'Открывает лёгкую пехоту для лесов и гор.',4,155],
['columns','Пехотные формирования','Колонны и каре',['lightinf','bayonets'],'Лучше оборона против кавалерии и наступление.',4,160],
['conscription','Пехотные формирования','Система рекрутских наборов',['infantry_forms'],'Снижает стоимость найма полков.',4,140],
['professional_army','Пехотные формирования','Постоянная армия',['conscription','lineinf'],'Увеличивает мораль профессиональных частей.',5,205],
['rankfire','Пехотное оружие','Залповый огонь шеренгами',['flintlock'],'Увеличивает огневую мощь пехоты.',3,125],
['platoonfire','Пехотное оружие','Повзводный огонь',['rankfire'],'Ещё более точная и устойчивая стрельба.',4,165],
['muskets_standard','Пехотное оружие','Унификация мушкетов',['flintlock','manufactory'],'Удешевляет подготовку обычных полков.',4,155],
['rifling','Пехотное оружие','Нарезные штуцеры',['rankfire'],'Усиливает егерские и лёгкие части.',5,205],
['bayonetdrill','Пехотное оружие','Штыковой бой и приклад',['bayonets'],'Усиливает атакующую стойкость линейной пехоты.',4,165],
['powdermills','Пехотное оружие','Пороховые мельницы',['manufactory'],'Дешевле артиллерия и боевые запасы.',4,150],
['dragoons','Конница','Драгунские полки',['cavalry'],'Открывает универсальные драгунские полки.',3,115],
['cuirassiers','Конница','Кирасирские части',['dragoons'],'Открывает тяжёлую ударную кавалерию.',4,165],
['hussars','Конница','Гусары и разведка',['dragoons'],'Открывает быструю лёгкую конницу.',4,150],
['studs','Конница','Казённые конные заводы',['dragoons'],'Повышает скорость маршей кавалерии.',4,150],
['cavalrycharge','Конница','Тактика массированной атаки',['cuirassiers','hussars'],'Повышает силу кавалерийской атаки.',5,210],
['lightart','Артиллерия и осады','Полевая артиллерия',['artillery'],'Открывает лёгкие мобильные батареи.',3,120],
['heavyart','Артиллерия и осады','Тяжёлые осадные батареи',['artillery'],'Открывает тяжёлые орудия.',4,160],
['mortars','Артиллерия и осады','Мортиры и гаубицы',['heavyart'],'Усиливает осады укреплений.',4,170],
['sappers','Артиллерия и осады','Сапёрные батальоны',['siege'],'Усиливает штурмы и атаку против фортов.',4,170],
['gribeauval','Артиллерия и осады','Стандартизованная артиллерия',['lightart','muskets_standard'],'Скорость и сила полевых батарей повышены.',5,235],
['horseart','Артиллерия и осады','Конная артиллерия',['gribeauval','dragoons'],'Мобильные батареи в составе полевых армий.',5,215],
['fortress_school','Артиллерия и осады','Бастионная фортификация',['siege'],'Укрепления ещё сильнее в обороне.',5,185],
['surveys','Логистика','Военные геодезисты',['roads'],'Снижает время маршей в знакомых регионах.',3,105],
['fieldcarts','Логистика','Полковые обозы',['magazine'],'Снижает расход провианта.',4,155],
['pontoons','Логистика','Понтонные парки',['surveys','magazine'],'Ускоряет движение через речные рубежи.',4,165],
['quartermasters','Логистика','Интендантская служба',['fieldcarts','logistics'],'Поддерживает снабжение дальних походов.',5,190],
['fieldmedicine','Логистика','Военно-полевые госпитали',['quartermasters'],'Снижает потери при поражении.',5,175],
['staffcollege','Управление','Военные академии',['academies','drill'],'Повышает организацию и боевой дух всех полков.',4,165],
['generalstaff','Управление','Генеральные штабы',['staffcollege','logistics'],'Ускоряет марши и улучшает планирование операций.',6,245],
['portinspections','Флот','Портовое адмиралтейство',['shipyards'],'Ускоряет постройку кораблей.',3,115],
['frigatedesign','Флот','Фрегаты нового образца',['rigging','gunnery'],'Повышает эффективность фрегатов.',4,155],
['linebattle','Флот','Линейная баталия',['gunnery','signals'],'Повышает эффективность линейных кораблей.',5,195],
['coppering','Флот','Медная обшивка корпусов',['shipyards','navigation'],'Повышает скорость движения флота.',5,215],
['navalcollege','Флот','Морские кадетские корпуса',['signals','academies'],'Повышает мораль эскадр.',5,215],
['convoys','Морская торговля','Система торговых конвоев',['trade','navigation'],'Повышает доход от торговли и защищает перевозки.',4,175],
['drydock','Флот','Сухие доки и оснастка',['portinspections','shipyards'],'Снижает срок строительства тяжёлых кораблей.',5,205],
['mining','Хозяйство','Горные промыслы',['manufactory'],'Повышает добычу железа.',4,140],
['textile','Хозяйство','Текстильные мануфактуры',['manufactory','agriculture'],'Дополнительные доходы провинций.',4,155],
['centralbank','Хозяйство','Центральная казённая палата',['banking','cadastre'],'Повышает доход казны.',5,200],
['cropcycle','Хозяйство','Севооборот нового типа',['agriculture','grainstore'],'Повышает урожайность ферм.',5,165],
['enclosure','Хозяйство','Земельные преобразования',['cropcycle','cadastre'],'Улучшает производство продовольствия.',5,205],
['mercantilism','Морская торговля','Меркантилистская политика',['trade','banking'],'Увеличивает прибыль от рынков и портов.',4,175],
];
for(let [id,cat,name,req,desc,time,cost] of TECHNOLOGY_EXPANSION)TECH.push({id,cat,name,req,desc,time,cost});
for(let t of TECH){if(['drill'].includes(t.id))t.cat='Пехотные формирования';
else if(['flintlock','bayonets'].includes(t.id))t.cat='Пехотное оружие';
else if(['cavalry'].includes(t.id))t.cat='Конница';
else if(['artillery','siege'].includes(t.id))t.cat='Артиллерия и осады'}
const V5_TECH=[{"id":"parishschools","name":"Приходские школы","cat":"Образование","desc":"Расширяет грамотность и открывает начальное образование.","req":[],"cost":70,"time":2,"eduMin":0,"icon":"📚"},{"id":"printshops","name":"Типографии и учебники","cat":"Образование","desc":"Повышает качество подготовки учёных.","req":["parishschools"],"cost":85,"time":3,"eduMin":18,"icon":"📚"},{"id":"universities","name":"Университетские кафедры","cat":"Образование","desc":"Даёт более быстрые научные исследования.","req":["printshops"],"cost":120,"time":4,"eduMin":26,"icon":"📚"},{"id":"royalacademies","name":"Королевские академии наук","cat":"Образование","desc":"Развивает практические естественные науки.","req":["universities","academies"],"cost":140,"time":4,"eduMin":34,"icon":"📚"},{"id":"scientificmethod","name":"Экспериментальный метод","cat":"Образование","desc":"Улучшает темп исследований.","req":["royalacademies"],"cost":185,"time":5,"eduMin":42,"icon":"📚"},{"id":"technicalschools","name":"Инженерные школы","cat":"Образование","desc":"Ускоряет строительство и научные открытия.","req":["scientificmethod"],"cost":230,"time":6,"eduMin":52,"icon":"📚"},{"id":"researchsocieties","name":"Учёные общества","cat":"Образование","desc":"Повышает образование и распространение новшеств.","req":["technicalschools"],"cost":260,"time":6,"eduMin":62,"icon":"📚"},{"id":"encyclopedists","name":"Энциклопедическое знание","cat":"Образование","desc":"Расширяет доступность поздних технологий.","req":["researchsocieties"],"cost":300,"time":7,"eduMin":73,"icon":"📚"},{"id":"universalreading","name":"Массовые школы грамотности","cat":"Образование","desc":"Повышает грамотность населения.","req":["encyclopedists"],"cost":350,"time":7,"eduMin":80,"icon":"📚"},{"id":"gun4","name":"Корабельные 4-фунтовые пушки","cat":"Морская артиллерия","desc":"Лёгкие орудия для шлюпов и малых кораблей.","req":[],"cost":70,"time":2,"eduMin":0,"icon":"💣"},{"id":"gun6","name":"6-фунтовая палубная артиллерия","cat":"Морская артиллерия","desc":"Универсальные орудия небольших кораблей.","req":["gun4"],"cost":90,"time":3,"eduMin":16,"icon":"💣"},{"id":"gun9","name":"9-фунтовая корабельная артиллерия","cat":"Морская артиллерия","desc":"Улучшает вооружение лёгких фрегатов.","req":["gun6"],"cost":105,"time":3,"eduMin":22,"icon":"💣"},{"id":"gun12","name":"12-фунтовые длинные пушки","cat":"Морская артиллерия","desc":"Стандартное вооружение фрегатов.","req":["gun9","gunnery"],"cost":130,"time":4,"eduMin":31,"icon":"💣"},{"id":"gun18","name":"18-фунтовая палубная батарея","cat":"Морская артиллерия","desc":"Усиливает тяжёлые фрегаты и нижние батареи.","req":["gun12"],"cost":160,"time":4,"eduMin":40,"icon":"💣"},{"id":"gun24","name":"24-фунтовые орудия","cat":"Морская артиллерия","desc":"Сильный бортовой залп линейных кораблей.","req":["gun18"],"cost":190,"time":5,"eduMin":49,"icon":"💣"},{"id":"gun32","name":"32-фунтовые тяжёлые пушки","cat":"Морская артиллерия","desc":"Большой урон ценой массы и медленной перезарядки.","req":["gun24","linebattle"],"cost":235,"time":6,"eduMin":59,"icon":"💣"},{"id":"gun42","name":"42-фунтовые нижнепалубные пушки","cat":"Морская артиллерия","desc":"Тяжелейшие орудия трёхпалубных кораблей.","req":["gun32"],"cost":285,"time":7,"eduMin":73,"icon":"💣"},{"id":"gunfoundries","name":"Казённые литейные мастерские","cat":"Морская артиллерия","desc":"Снижает стоимость морской артиллерии.","req":["gun18","mining"],"cost":235,"time":5,"eduMin":46,"icon":"💣"},{"id":"guncarriages","name":"Усовершенствованные лафеты","cat":"Морская артиллерия","desc":"Повышает темп стрельбы и управляемость пушек.","req":["gun24","gunfoundries"],"cost":260,"time":6,"eduMin":57,"icon":"💣"},{"id":"courtbureau","name":"Королевская канцелярия","cat":"Государственные реформы","desc":"Повышает эффективность государственных решений.","req":["cadastre"],"cost":105,"time":3,"eduMin":16,"icon":"🏛️"},{"id":"courtaccounts","name":"Государственные аудиторы","cat":"Государственные реформы","desc":"Уменьшает потери казны.","req":["courtbureau"],"cost":120,"time":4,"eduMin":25,"icon":"🏛️"},{"id":"districtschools","name":"Губернские школы","cat":"Государственные реформы","desc":"Сочетание административной и образовательной реформ.","req":["courtaccounts","parishschools"],"cost":145,"time":4,"eduMin":33,"icon":"🏛️"},{"id":"publichealth","name":"Городская санитария","cat":"Государственные реформы","desc":"Укрепляет устойчивость и управление городами.","req":["districtschools"],"cost":165,"time":5,"eduMin":39,"icon":"🏛️"},{"id":"judicialreform","name":"Судебные реформы","cat":"Государственные реформы","desc":"Снижает беспорядки и повышает доверие подданных.","req":["publichealth"],"cost":195,"time":5,"eduMin":49,"icon":"🏛️"},{"id":"professionalservice","name":"Профессиональные чиновники","cat":"Государственные реформы","desc":"Повышает эффективность финансов и образования.","req":["judicialreform"],"cost":225,"time":6,"eduMin":56,"icon":"🏛️"},{"id":"regionaladministration","name":"Провинциальные управления","cat":"Государственные реформы","desc":"Улучшает сбор налогов и снабжение.","req":["professionalservice"],"cost":265,"time":6,"eduMin":65,"icon":"🏛️"},{"id":"constitutionalcharters","name":"Хартии и представительные учреждения","cat":"Государственные реформы","desc":"Укрепляет легитимность и стабильность.","req":["regionaladministration"],"cost":310,"time":7,"eduMin":75,"icon":"🏛️"},{"id":"watermills","name":"Водяные мельницы","cat":"Хозяйство","desc":"Дополнительный доход зерновых провинций.","req":["agriculture"],"cost":100,"time":3,"eduMin":17,"icon":"⚒️"},{"id":"charcoal","name":"Древесный уголь и доменные печи","cat":"Хозяйство","desc":"Повышает доходы кузниц и металлургии.","req":["manufactory"],"cost":125,"time":3,"eduMin":24,"icon":"⚒️"},{"id":"blastfurnace","name":"Высокие доменные печи","cat":"Хозяйство","desc":"Сильнее добыча железа.","req":["charcoal","mining"],"cost":160,"time":4,"eduMin":34,"icon":"⚒️"},{"id":"precisiontools","name":"Точные мастеровые инструменты","cat":"Хозяйство","desc":"Ускоряет изготовление оружия и механизмов.","req":["blastfurnace"],"cost":180,"time":5,"eduMin":43,"icon":"⚒️"},{"id":"canalworks","name":"Каналы и шлюзы","cat":"Хозяйство","desc":"Повышает эффективность торговли и логистики.","req":["roads","watermills"],"cost":175,"time":4,"eduMin":32,"icon":"⚒️"},{"id":"steamdrainage","name":"Паровые водоотливные насосы","cat":"Хозяйство","desc":"Повышает добычу железа и производительность рудников.","req":["precisiontools","canalworks"],"cost":265,"time":6,"eduMin":62,"icon":"⚒️"},{"id":"mechanicalspinning","name":"Механизированные прядильни","cat":"Хозяйство","desc":"Повышает доход мануфактур.","req":["textile","precisiontools"],"cost":250,"time":6,"eduMin":57,"icon":"⚒️"},{"id":"coalmines","name":"Каменноугольные шахты","cat":"Хозяйство","desc":"Улучшает металлургию и строительство.","req":["steamdrainage"],"cost":310,"time":7,"eduMin":73,"icon":"⚒️"},{"id":"interchangeableparts","name":"Унификация деталей","cat":"Хозяйство","desc":"Ускоряет подготовку полков и верфей.","req":["mechanicalspinning","precisiontools"],"cost":285,"time":6,"eduMin":68,"icon":"⚒️"},{"id":"oakplantations","name":"Дубовые корабельные леса","cat":"Кораблестроение","desc":"Больше древесины для строительства.","req":["shipyards"],"cost":105,"time":3,"eduMin":15,"icon":"🛠️"},{"id":"frames","name":"Наборные шпангоуты","cat":"Кораблестроение","desc":"Снижает расходы на корпуса.","req":["oakplantations"],"cost":140,"time":4,"eduMin":27,"icon":"🛠️"},{"id":"deckplans","name":"Чертежи палуб и переборок","cat":"Кораблестроение","desc":"Ускоряет сборку корпусов.","req":["frames"],"cost":160,"time":4,"eduMin":33,"icon":"🛠️"},{"id":"frigatehulls","name":"Улучшенные фрегатские обводы","cat":"Кораблестроение","desc":"Усиливает фрегаты.","req":["deckplans","frigatedesign"],"cost":175,"time":5,"eduMin":41,"icon":"🛠️"},{"id":"shiptimber","name":"Сушка и стандартизация древесины","cat":"Кораблестроение","desc":"Снижает стоимость судостроения.","req":["deckplans","charcoal"],"cost":185,"time":5,"eduMin":45,"icon":"🛠️"},{"id":"navalarchitects","name":"Корпусные инженеры","cat":"Кораблестроение","desc":"Улучшает скорость и прочность флота.","req":["frigatehulls","shiptimber"],"cost":230,"time":6,"eduMin":58,"icon":"🛠️"},{"id":"tripledeck","name":"Трёхпалубные линейные корабли","cat":"Кораблестроение","desc":"Серьёзно усиливает линейные эскадры.","req":["navalarchitects","linebattle"],"cost":285,"time":7,"eduMin":74,"icon":"🛠️"},{"id":"blockandpulleys","name":"Механизация верфей","cat":"Кораблестроение","desc":"Ускоряет корабельные постройки.","req":["drydock","navalarchitects"],"cost":270,"time":6,"eduMin":62,"icon":"🛠️"},{"id":"standardizedshipyard","name":"Стандартизованные корпуса","cat":"Кораблестроение","desc":"Уменьшает время и стоимость строительства.","req":["blockandpulleys"],"cost":330,"time":7,"eduMin":78,"icon":"🛠️"},{"id":"cadetcorps","name":"Кадетские корпуса","cat":"Пехотные формирования","desc":"Улучшает подготовку кадров.","req":["professional_army"],"cost":180,"time":5,"eduMin":38,"icon":"⚔️"},{"id":"regularpay","name":"Регулярное жалование","cat":"Пехотные формирования","desc":"Повышает мораль регулярных полков.","req":["conscription"],"cost":130,"time":3,"eduMin":22,"icon":"⚔️"},{"id":"quarterline","name":"Гибкое построение батальона","cat":"Пехотные формирования","desc":"Повышает защиту пехоты.","req":["platoonfire","columns"],"cost":210,"time":5,"eduMin":48,"icon":"⚔️"},{"id":"brigadeorganization","name":"Бригадные соединения","cat":"Пехотные формирования","desc":"Улучшает организацию армии.","req":["quarterline","cadetcorps"],"cost":240,"time":6,"eduMin":56,"icon":"⚔️"},{"id":"divisioncolumns","name":"Дивизионные маршевые колонны","cat":"Пехотные формирования","desc":"Ускоряет движение больших армий.","req":["brigadeorganization"],"cost":280,"time":6,"eduMin":67,"icon":"⚔️"},{"id":"battletraining","name":"Военные учения с боевой стрельбой","cat":"Пехотные формирования","desc":"Усиливает огонь и мораль.","req":["divisioncolumns"],"cost":320,"time":7,"eduMin":75,"icon":"⚔️"},{"id":"remount","name":"Ремонтные конные службы","cat":"Конница","desc":"Уменьшает снабжение конницы.","req":["studs"],"cost":135,"time":4,"eduMin":29,"icon":"🐎"},{"id":"carabiniers","name":"Карабинерные части","cat":"Конница","desc":"Улучшает огневую мощь конницы.","req":["dragoons"],"cost":155,"time":4,"eduMin":30,"icon":"🐎"},{"id":"cavalryschools","name":"Кавалерийские школы","cat":"Конница","desc":"Улучшает кавалерийские атаки.","req":["cavalrycharge"],"cost":210,"time":5,"eduMin":48,"icon":"🐎"},{"id":"reconpatrols","name":"Передовые разведывательные патрули","cat":"Конница","desc":"Ускоряет маневры.","req":["hussars","surveys"],"cost":180,"time":4,"eduMin":38,"icon":"🐎"},{"id":"mountedstaff","name":"Конные офицеры связи","cat":"Конница","desc":"Более быстрая координация штабов.","req":["reconpatrols","cavalryschools"],"cost":230,"time":6,"eduMin":54,"icon":"🐎"},{"id":"riverports","name":"Речные пристани","cat":"Логистика","desc":"Улучшает снабжение внутренних областей.","req":["roads"],"cost":115,"time":3,"eduMin":23,"icon":"🧭"},{"id":"warehousenetwork","name":"Военные склады округа","cat":"Логистика","desc":"Повышает надёжность снабжения.","req":["magazine","riverports"],"cost":170,"time":4,"eduMin":34,"icon":"🧭"},{"id":"freightcontracts","name":"Подрядчики военных обозов","cat":"Логистика","desc":"Снижает стоимость экспедиций.","req":["fieldcarts","warehousenetwork"],"cost":195,"time":5,"eduMin":45,"icon":"🧭"},{"id":"forageplans","name":"Система фуражировки","cat":"Логистика","desc":"Снижает продовольственные расходы армии.","req":["quartermasters"],"cost":190,"time":5,"eduMin":48,"icon":"🧭"},{"id":"regionaldepots","name":"Военные округа и депо","cat":"Логистика","desc":"Повышает снабжение при походах.","req":["freightcontracts","forageplans"],"cost":265,"time":6,"eduMin":64,"icon":"🧭"},{"id":"marchtables","name":"Оперативные таблицы маршей","cat":"Логистика","desc":"Сокращает длительность переходов.","req":["regionaldepots","generalstaff"],"cost":315,"time":7,"eduMin":76,"icon":"🧭"},{"id":"harborquays","name":"Портовые причалы","cat":"Морская торговля","desc":"Больше доходов из портов.","req":["trade"],"cost":115,"time":3,"eduMin":21,"icon":"🧭"},{"id":"charteredcompany","name":"Привилегированные компании","cat":"Морская торговля","desc":"Улучшает международную торговлю.","req":["harborquays","insurance"],"cost":175,"time":4,"eduMin":39,"icon":"🧭"},{"id":"colonialbank","name":"Колониальные кредитные общества","cat":"Морская торговля","desc":"Повышает финансовые доходы торговли.","req":["charteredcompany","centralbank"],"cost":210,"time":5,"eduMin":50,"icon":"🧭"},{"id":"tradeledgers","name":"Единые торговые реестры","cat":"Морская торговля","desc":"Стабилизирует торговлю.","req":["charteredcompany"],"cost":190,"time":5,"eduMin":46,"icon":"🧭"},{"id":"transitduties","name":"Транзитные пошлины","cat":"Морская торговля","desc":"Укрепляет таможенный доход.","req":["tradeledgers"],"cost":225,"time":5,"eduMin":56,"icon":"🧭"},{"id":"globalcontracts","name":"Международные морские контракты","cat":"Морская торговля","desc":"Увеличивает доходы морской торговли.","req":["colonialbank","transitduties"],"cost":320,"time":7,"eduMin":72,"icon":"🧭"},{"id":"navalcharts","name":"Морские карты и лоции","cat":"Флот","desc":"Ускоряет морские операции.","req":["navigation"],"cost":140,"time":4,"eduMin":27,"icon":"⚓"},{"id":"fleetcommand","name":"Флотские штабы","cat":"Флот","desc":"Повышает боевую организацию кораблей.","req":["signals","navalcollege"],"cost":195,"time":5,"eduMin":47,"icon":"⚓"},{"id":"signalflags","name":"Кодовые сигнальные флаги","cat":"Флот","desc":"Повышает боевую силу эскадр.","req":["fleetcommand"],"cost":210,"time":5,"eduMin":51,"icon":"⚓"},{"id":"lineformations","name":"Гибкое маневрирование линией","cat":"Флот","desc":"Повышает линейную тактику флота.","req":["linebattle","signalflags"],"cost":255,"time":6,"eduMin":62,"icon":"⚓"},{"id":"longcruises","name":"Дальние крейсерства","cat":"Флот","desc":"Снижает время морских экспедиций.","req":["navalcharts","coppering"],"cost":250,"time":6,"eduMin":60,"icon":"⚓"},{"id":"oceaniclogistics","name":"Снабжение океанских эскадр","cat":"Флот","desc":"Улучшает эффективность дальних походов.","req":["longcruises","lineformations"],"cost":315,"time":7,"eduMin":74,"icon":"⚓"},{"id":"ballistics","name":"Баллистические таблицы","cat":"Артиллерия и осады","desc":"Усиливает полевую артиллерию.","req":["artillery"],"cost":135,"time":4,"eduMin":25,"icon":"💥"},{"id":"ironshot","name":"Литьё круглых ядер","cat":"Артиллерия и осады","desc":"Усиливает батареи и корабельные пушки.","req":["ballistics","charcoal"],"cost":150,"time":4,"eduMin":32,"icon":"💥"},{"id":"fieldfortifications","name":"Земляные полевые укрепления","cat":"Артиллерия и осады","desc":"Увеличивает оборону полков.","req":["siege"],"cost":145,"time":4,"eduMin":30,"icon":"💥"},{"id":"siegeengineers","name":"Инженерные осадные корпуса","cat":"Артиллерия и осады","desc":"Улучшает наступление на крепости.","req":["sappers","fieldfortifications"],"cost":220,"time":5,"eduMin":51,"icon":"💥"},{"id":"shrapnel","name":"Разрывные артиллерийские снаряды","cat":"Артиллерия и осады","desc":"Усиливает позднюю артиллерию.","req":["ironshot","mortars"],"cost":290,"time":7,"eduMin":73,"icon":"💥"},{"id":"artilleryschools","name":"Батарейные офицерские школы","cat":"Артиллерия и осады","desc":"Повышает темп и точность огня.","req":["ballistics","gribeauval"],"cost":250,"time":6,"eduMin":63,"icon":"💥"}];
for(const t of V5_TECH) TECH.push(t);
const NATIONAL=[
 {title:'Морская торговля',mods:{shipCost:.85,shipTime:.88,trade:1.18},ruler:'Вильгельм III',quality:'navy'},
 {title:'Королевская армия',mods:{infAttack:1.13,stability:3,armyCost:.94},ruler:'Людовик XIV',quality:'army'},
 {title:'Иберийские владения',mods:{trade:1.10,fort:1.10},ruler:'Карл II',quality:'court'},
 {title:'Атлантическая торговля',mods:{shipTime:.92,trade:1.16},ruler:'Педру II',quality:'navy'},
 {title:'Купеческая республика',mods:{trade:1.21,shipCost:.92},ruler:'Вильгельм III (штатгальтер)',quality:'trade'},
 {title:'Династические связи',mods:{stability:7,fort:1.12},ruler:'Леопольд I',quality:'court'},
 {title:'Полковая дисциплина',mods:{infAttack:1.12,armyCost:.90},ruler:'Фридрих III (курфюрст)',quality:'army'},
 {title:'Гусарская конница',mods:{cavalry:1.20,fort:1.05},ruler:'Август II',quality:'cavalry'},
 {title:'Балтийский военный флот',mods:{navalPower:1.13,shipTime:.92},ruler:'Карл XII',quality:'navy'},
 {title:'Контроль проливов',mods:{shipCost:.91,trade:1.13},ruler:'Фредерик IV',quality:'trade'},
 {title:'Военная модернизация',mods:{research:1.08,armyCost:.91},ruler:'Пётр I',quality:'research'},
 {title:'Армия Порты',mods:{armyCost:.92,trade:1.10},ruler:'Мустафа II',quality:'army'},
 {title:'Адриатическая республика',mods:{shipTime:.88,trade:1.13},ruler:'Дож Сильвестро Вальер',quality:'navy'},
 {title:'Альпийские крепости',mods:{fort:1.20,stability:4},ruler:'Виктор Амадей II',quality:'court'},
 {title:'Горная оборона',mods:{fort:1.20,infAttack:1.06},ruler:'Вильгельм II Шотландский',quality:'army'},
 {title:'Княжеские мастерские',mods:{trade:1.09,research:1.07},ruler:'Совет княжеских дворов',quality:'research'},
 {title:'Рудники и ремесло',mods:{industry:1.17,research:1.06},ruler:'Август II (курфюрст)',quality:'research'},
 {title:'Городские академии',mods:{education:1.16,trade:1.10},ruler:'Советы итальянских дворов',quality:'research'},
 {title:'Магрибская торговля',mods:{trade:1.11,stability:3},ruler:'Мулай Исмаил',quality:'trade'},
 {title:'Средиземноморские рейды',mods:{navalPower:1.15,trade:1.06},ruler:'Дей Алжира',quality:'navy'}
];
const BONUS_NAMES={shipCost:'Стоимость кораблей',shipTime:'Срок судостроения',trade:'Доходы торговли',navalPower:'Сила флота',infAttack:'Атака пехоты',armyCost:'Стоимость набора армии',cavalry:'Атака кавалерии',fort:'Оборона крепостей',research:'Скорость исследований',education:'Рост образования',industry:'Доходы мануфактур',stability:'Стабильность (пункты)'};
const ADVISERS=[
 {id:'rector',icon:'📚',name:'Ректор королевской академии',role:'Образование',money:130,salary:9,mods:{research:1.14,education:1.30},desc:'Исследования +14%, развитие образования +30%'},
 {id:'minister',icon:'💰',name:'Генеральный казначей',role:'Экономика',money:115,salary:8,mods:{trade:1.14},desc:'Налоговые и торговые доходы +14%'},
 {id:'admiral',icon:'⚓',name:'Первый лорд адмиралтейства',role:'Флот',money:165,salary:12,mods:{shipTime:.82,navalPower:1.10},desc:'Судостроение на 18% быстрее, сила флота +10%'},
 {id:'artillerist',icon:'💣',name:'Инспектор артиллерии',role:'Армия',money:145,salary:10,mods:{artillery:1.15},desc:'Атака артиллерии +15%'},
 {id:'statesman',icon:'🏛️',name:'Главный канцлер',role:'Двор',money:125,salary:9,mods:{stability:5},desc:'Стабильность +5 пунктов при назначении'},
 {id:'merchant',icon:'🧭',name:'Председатель торговой палаты',role:'Экономика',money:135,salary:10,mods:{trade:1.17},desc:'Торговые доходы +17%'},
 {id:'general',icon:'⚔️',name:'Генерал-инспектор пехоты',role:'Армия',money:155,salary:11,mods:{infAttack:1.13},desc:'Атака пехотных частей +13%'},
 {id:'engineer',icon:'🛠️',name:'Главный корабельный мастер',role:'Флот',money:150,salary:11,mods:{shipCost:.90},desc:'Строительство кораблей дешевле на 10%'},
 {id:'jurist',icon:'⚖️',name:'Королевский юрист',role:'Двор',money:130,salary:8,mods:{stability:4},desc:'Стабильность +4 пункта при назначении'}
];
const CANNONS=[
 {lb:4,id:'gun4',atk:1.1,reload:1.0,range:360,weight:.9,iron:4,category:'Шлюпы'},
 {lb:6,id:'gun6',atk:1.55,reload:1.17,range:420,weight:1.25,iron:6,category:'Шлюпы / фрегаты'},
 {lb:9,id:'gun9',atk:2.2,reload:1.36,range:490,weight:1.75,iron:9,category:'Фрегаты'},
 {lb:12,id:'gun12',atk:2.9,reload:1.59,range:560,weight:2.45,iron:12,category:'Фрегаты'},
 {lb:18,id:'gun18',atk:4.0,reload:1.95,range:620,weight:3.6,iron:18,category:'Тяжёлые фрегаты'},
 {lb:24,id:'gun24',atk:5.1,reload:2.40,range:700,weight:5.0,iron:24,category:'Линейные корабли'},
 {lb:32,id:'gun32',atk:6.2,reload:2.90,range:770,weight:7.2,iron:32,category:'Линейные корабли'},
 {lb:42,id:'gun42',atk:7.4,reload:3.60,range:840,weight:10.4,iron:42,category:'Тяжёлые линейные'}
];
const REGIMENTS={
inf:{label:'Мушкетёры',type:'Пехота',icon:'⚔',atk:1.0,def:1.15,speed:3.3,supply:1.3,morale:65,days:28},
cav:{label:'Рейтары',type:'Конница',icon:'♞',atk:1.55,def:1.0,speed:5.5,supply:2,morale:66,days:42},
art:{label:'Полевая батарея',type:'Артиллерия',icon:'⚙',atk:2.25,def:1.25,speed:2.5,supply:2.2,morale:58,days:57},
militia:{label:'Ополчение',type:'Пехота',icon:'⚑',atk:.6,def:.72,speed:2.9,supply:.8,morale:43,days:17,req:'militia',cost:{gold:25,food:9,wood:0,iron:3}},
lineinf:{label:'Линейная пехота',type:'Пехота',icon:'⚔',atk:1.45,def:1.52,speed:3.4,supply:1.5,morale:76,days:35,req:'lineinf',cost:{gold:78,food:20,wood:0,iron:11}},
fusiliers:{label:'Фузилёры',type:'Пехота',icon:'⚔',atk:1.7,def:1.55,speed:3.5,supply:1.65,morale:79,days:43,req:'fusiliers',cost:{gold:100,food:22,wood:0,iron:15}},
grenadiers:{label:'Гренадеры',type:'Пехота',icon:'✸',atk:1.95,def:1.7,speed:3.3,supply:1.85,morale:84,days:54,req:'grenadiers',cost:{gold:140,food:30,wood:0,iron:20}},
lightinf:{label:'Егеря',type:'Пехота',icon:'✥',atk:1.28,def:1.42,speed:4.4,supply:1.25,morale:74,days:42,req:'lightinf',cost:{gold:91,food:20,wood:0,iron:12}},
guards:{label:'Гвардия',type:'Пехота',icon:'♛',atk:2.25,def:2.15,speed:3.5,supply:2.25,morale:97,days:83,req:'guards',cost:{gold:235,food:42,wood:0,iron:30}},
dragoons:{label:'Драгуны',type:'Конница',icon:'♞',atk:1.48,def:1.36,speed:5.0,supply:1.95,morale:73,days:51,req:'dragoons',cost:{gold:110,food:27,wood:0,iron:12}},
cuirassiers:{label:'Кирасиры',type:'Конница',icon:'♞',atk:2.2,def:1.58,speed:4.7,supply:2.7,morale:87,days:70,req:'cuirassiers',cost:{gold:183,food:40,wood:0,iron:29}},
hussars:{label:'Гусары',type:'Конница',icon:'♞',atk:1.5,def:1.05,speed:6.6,supply:2.05,morale:73,days:49,req:'hussars',cost:{gold:125,food:30,wood:0,iron:14}},
lightart:{label:'Лёгкая артиллерия',type:'Артиллерия',icon:'⚙',atk:2.25,def:1.25,speed:3.4,supply:1.9,morale:67,days:53,req:'lightart',cost:{gold:135,food:9,wood:22,iron:35}},
heavyart:{label:'Осадная артиллерия',type:'Артиллерия',icon:'⚙',atk:3.6,def:1.4,speed:1.6,supply:3.5,morale:64,days:85,req:'heavyart',cost:{gold:230,food:14,wood:38,iron:70}},
horseart:{label:'Конная артиллерия',type:'Артиллерия',icon:'⚙',atk:2.85,def:1.32,speed:5,supply:2.7,morale:74,days:71,req:'horseart',cost:{gold:205,food:30,wood:29,iron:49}},
};
const UNITKEYS=Object.keys(REGIMENTS),REGCAT=['Пехота','Конница','Артиллерия'];
const armyUnits=p=>p.units||{};
const totalExtra=p=>Object.values(armyUnits(p)).reduce((a,b)=>a+(Number(b)||0),0);
const countUnit=(p,k)=>['inf','cav','art'].includes(k)?(p[k]||0):(p.units?.[k]||0);
const unitCost=k=>REGIMENTS[k]?.cost||UNIT[k]?.cost;
const $=id=>document.getElementById(id), clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=t=>String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const fmt=n=>Math.floor(n).toLocaleString('ru-RU');
const NUM=F.length, YEAR0=1700, TERR={plain:['Равнины','#829177',1],hills:['Холмы','#798570',1.16],mountain:['Горы','#737a74',1.34],taiga:['Леса','#506e64',1.19],steppe:['Степи','#a59a70',1.06]};
const CAP=F.map(f=>N.findIndex(n=>n.name===f.capital));
const code=(a,b)=>[a,b].sort((x,y)=>x-y).join(':');
const has=(f,id)=>!!s?.tech?.[f]?.includes(id);
const own=i=>s.provinces[i].owner===s.player;
const armies=p=>(p.inf||0)+(p.cav||0)+(p.art||0)+totalExtra(p), vessels=p=>(p.sloop||0)+(p.frigate||0)+(p.line||0);
const regOf=(f)=>s.provinces.map((p,i)=>({p,i})).filter(z=>z.p.owner===f);
const withWar=(a,b)=>s.wars.includes(code(a,b)), withAlliance=(a,b)=>s.allies.includes(code(a,b)), withTrade=(a,b)=>s.treaties.includes(code(a,b));
const SEAS=['Атлантика','Ла-Манш','Северное море','Балтика','Западное Средиземноморье','Восточное Средиземноморье','Чёрное море'];
const ZONEADJ=[[0,1],[1,2],[2,3],[0,4],[4,5],[5,6],[2,4]].map(a=>a.join(':'));
const adjacentSea=(a,b)=>a===b||ZONEADJ.includes(code(a,b));
const distKm=(a,b)=>{let x=(a.lon-b.lon)*Math.cos((a.lat+b.lat)*Math.PI/360)*111,y=(a.lat-b.lat)*111;return Math.hypot(x,y)};
let mapSignature='',mapOwnersSignature='',s=null,selected=0,tab='province',mission=null,mode='political',dipTarget=1,techCat='Пехотные формирования',armyCat='Пехота',treeCat='Пехотные формирования',isPlaying=false,gameSpeed=2,clockAccumulator=0,lastFrame=0,clockHandle=null,zoom=1,panX=0,panY=0,dragging=false,dragged=false,lastPt=null,toastTimer=null;
const UNIT={inf:{label:'Пехотный полк',cost:cost(55,16,0,7)},cav:{label:'Кавалерийский полк',cost:cost(88,22,0,9)},art:{label:'Артиллерийская батарея',cost:cost(110,8,16,30)},sloop:{label:'Шлюп',cost:cost(80,0,30,11)},frigate:{label:'Фрегат',cost:cost(165,0,70,40)},line:{label:'Линейный корабль',cost:cost(290,0,135,90)}};
const BUILD={farm:{label:'Расширить сельское хозяйство',cost:cost(75,0,21)},workshop:{label:'Создать мануфактуру',cost:cost(120,0,24,16)},market:{label:'Рынок и таможня',cost:cost(90,0,18)},dock:{label:'Расширить верфь',cost:cost(135,0,50,26)},fort:{label:'Новая линия укреплений',cost:cost(150,0,23,36)},road:{label:'Дороги и мосты',cost:cost(80,0,20)},depot:{label:'Армейский склад',cost:cost(95,0,30,7)}};
const MONTHS=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const DAY_INTERVAL=[0,820,420,200,95,42];
$('save').onclick=save;
$('load').onclick=load;
$('export').onclick=()=>{const data=new Blob([JSON.stringify(s)],{type:'application/json'}),url=URL.createObjectURL(data),a=document.createElement('a');a.href=url;a.download=`imperii-parusov-${s.year}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)};
$('import').onclick=()=>$('importfile').click();
$('importfile').onchange=async e=>{let file=e.target.files[0];if(!file)return;try{let data=JSON.parse(await file.text());restoreSave(data);saveQuiet();say('Файл кампании загружен')}catch(err){say('Ошибка загрузки JSON: '+err.message)}e.target.value=''};
$('new').onclick=newGame;
$('playpause').onclick=togglePause;
$('techtop').onclick=()=>showTechTree();
document.querySelectorAll('[data-speed]').forEach(b=>b.onclick=()=>speedSet(+b.dataset.speed));
$('zoomin').onclick=()=>zoomMap(1.35);
$('zoomout').onclick=()=>zoomMap(1/1.35);
$('zoomfit').onclick=resetMap;
$('tabs').querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>{tab=el.dataset.tab;mission=null;tabPanel()});
document.querySelectorAll('[data-mode]').forEach(el=>el.onclick=()=>{mode=el.dataset.mode;drawMap()});
$('modal').addEventListener('click',e=>{if(e.target===$('modal'))closeModal()});
const regionLayer=$('regions');
regionLayer.addEventListener('click',e=>{const p=e.target.closest('path[data-i]');if(p)selectProvince(+p.dataset.i)});
regionLayer.addEventListener('pointermove',e=>{const p=e.target.closest('path[data-i]');if(p)tip(e,+p.dataset.i)});
regionLayer.addEventListener('pointerleave',()=>{$('tooltip').style.display='none'});
const view=$('mapviewport');
view.addEventListener('wheel',e=>{e.preventDefault();let r=$('map').getBoundingClientRect(),x=(e.clientX-r.left)*1600/r.width,y=(e.clientY-r.top)*1080/r.height;zoomMap(e.deltaY<0?1.16:1/1.16,x,y)},{passive:false});
view.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;dragged=false;lastPt=[e.clientX,e.clientY];view.setPointerCapture(e.pointerId)});
view.addEventListener('pointermove',e=>{if(!dragging||!lastPt)return;let dx=e.clientX-lastPt[0],dy=e.clientY-lastPt[1];if(Math.abs(dx)+Math.abs(dy)>2)dragged=true;if(dragged){let r=$('map').getBoundingClientRect();panX+=dx*1600/r.width;panY+=dy*1080/r.height;clampPan();updateTransform()}lastPt=[e.clientX,e.clientY]});
view.addEventListener('pointerup',()=>{dragging=false;lastPt=null;setTimeout(()=>dragged=false,0)});
view.addEventListener('pointercancel',()=>{dragging=false;lastPt=null});
document.addEventListener('keydown',e=>{if((e.code==='Space'||e.key===' ')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){e.preventDefault();togglePause()}if(/^[1-5]$/.test(e.key)&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))speedSet(+e.key);if(e.key==='Escape'){mission=null;closeModal();drawAll()}if(e.key==='+'||e.key==='=')zoomMap(1.3);if(e.key==='-')zoomMap(1/1.3)});
const V6_ART={"musket": "assets/images/image.34a1a53df9aeb696.jpg", "infantry": "assets/images/image.5fb7c0e438987cfd.jpg", "cannon": "assets/images/image.ebfe3088f9c236c5.jpg", "cavalry": "assets/images/image.5a053c4682ac0133.jpg", "ship": "assets/images/image.9ec7c9b87c73b7c3.jpg", "industry": "assets/images/image.f4f63d56777e5bfb.jpg", "naval": "assets/images/image.8a6682189608d1af.jpg", "academy": "assets/images/image.06b7e1908220229a.jpg", "battle": "assets/images/image.da1632003c9d0c15.jpg", "gun": "assets/images/image.fd9a6f9d9cd86836.jpg", "shipguns": "assets/images/image.c1deed9a8283a6a5.jpg", "armor": "assets/images/image.9ef69d377600df17.jpg", "map": "assets/images/image.d08ce62e73aeb551.jpg", "money": "assets/images/image.ec93d7814a190590.jpg", "engineer": "assets/images/image.6eed1bdf24a676c9.jpg", "advisor": "assets/images/image.372e3545fe744276.jpg"};
const V6_ICON_CAT={
'Хозяйство':'industry','Управление':'academy','Логистика':'map','Флот':'ship','Морская торговля':'naval','Пехотные формирования':'infantry','Пехотное оружие':'musket','Конница':'cavalry','Артиллерия и осады':'cannon','Образование':'academy','Морская артиллерия':'gun','Государственные реформы':'advisor','Кораблестроение':'ship',
'Оружейная промышленность':'industry','Строевая подготовка':'infantry','Морская архитектура':'ship','Военные финансы':'money','Баллистика и боеприпасы':'cannon','Штабы и тактика':'battle'
};
const V6_EQUIP={
 musket:{name:'Кремнёвые мушкеты',art:'musket',iron:0.05,wood:0.04,gold:.12,work:0.12,tech:null,personnel:800},
 bayonet:{name:'Штыки',art:'musket',iron:0.025,wood:0,gold:.07,work:.10,tech:'muskets_standard'},
 gunpowder:{name:'Порох · бочки',art:'cannon',iron:0,wood:.1,gold:.9,work:.35,tech:null},
 uniform:{name:'Обмундирование',art:'infantry',iron:0,wood:.05,gold:.11,work:.18,tech:null},
 gun4:{name:'4-фунтовая пушка',art:'cannon',iron:2,wood:1.0,gold:2.5,work:5,tech:null},
 gun6:{name:'6-фунтовая пушка',art:'cannon',iron:3,wood:1.2,gold:3.5,work:7,tech:null},
 gun8:{name:'8-фунтовая пушка',art:'cannon',iron:4,wood:1.6,gold:4.7,work:9,tech:'gun8'},
 gun9:{name:'9-фунтовая пушка',art:'cannon',iron:4.6,wood:1.8,gold:5.0,work:10,tech:'gun9'},
 gun12:{name:'12-фунтовая пушка',art:'cannon',iron:6,wood:2.1,gold:6.2,work:13,tech:'gun12'},
 gun18:{name:'18-фунтовая пушка',art:'gun',iron:8,wood:3.1,gold:8.4,work:18,tech:'gun18'},
 gun24:{name:'24-фунтовая пушка',art:'gun',iron:11,wood:4,gold:11,work:24,tech:'gun24'},
 gun32:{name:'32-фунтовая пушка',art:'gun',iron:14,wood:5.2,gold:14,work:31,tech:'gun32'},
 gun42:{name:'42-фунтовая пушка',art:'gun',iron:19,wood:6.2,gold:18,work:39,tech:'gun42'}
};
CANNONS.push({lb:8,id:'gun8',atk:2.0,reload:1.28,range:468,weight:1.55,iron:8,category:'Фрегаты'});
CANNONS.sort((a,b)=>a.lb-b.lb);
const V6_SCHOOLS={
'Оружейная промышленность':[
['ironcasting','Стандарты чугунного литья',null,'gunCost',.92,23],['boremeasure','Калибровочные шаблоны','ironcasting','gunCost',.94,30],['arsenalregister','Арсенальная ведомость','ironcasting','arsenalSpeed',1.12,30],['interchangeparts','Взаимозаменяемые детали','boremeasure','arsenalSpeed',1.15,48],['foundryfurnace','Улучшенные литейные печи','ironcasting','arsenalSpeed',1.10,43],['gunproving','Орудийные испытания','boremeasure','gunAccuracy',1.10,48],['steamdrainage','Шахтные водоотливы','foundryfurnace','arsenalSpeed',1.08,61],['armoryinspection','Инспекция оружейных складов','arsenalregister','gunCost',.95,64]],
'Строевая подготовка':[
['platoonfire','Взводные залпы',null,'infantryAtk',1.08,25],['bayonetdrill','Штыковой строй','platoonfire','infantryAtk',1.06,32],['regimentstandard','Единый полковой устав','platoonfire','infantryDef',1.07,31],['skirmishscreen','Рассыпной строй','regimentstandard','infantryDef',1.09,43],['columnmarch','Маршевые колонны','regimentstandard','armySpeed',1.08,40],['countermarch','Контрмарш','columnmarch','armySpeed',1.06,51],['fieldhospital','Полевые санитарные службы','regimentstandard','armyLoss',.92,55],['trainedreserves','Обученный резерв','columnmarch','regimentTime',.88,64]],
'Морская архитектура':[
['hulllines','Теоретический чертёж корпуса',null,'shipTime',.94,26],['framepattern','Шаблоны шпангоутов','hulllines','shipCost',.95,30],['keelstrength','Усиленный киль','hulllines','shipHull',1.12,39],['copperplating','Медная обшивка','framepattern','shipSpeed',1.12,57],['mastproportion','Пропорции рангоута','hulllines','shipSpeed',1.07,34],['shiprigging','Стандартизация снастей','mastproportion','shipTime',.90,47],['drydockprojects','Проектировочные бюро','framepattern','shipCost',.92,63],['hullrevision','Совершенная обводка','copperplating','shipSpeed',1.08,72]],
'Военные финансы':[
['royalcontracts','Государственные контракты',null,'arsenalCost',.92,26],['banknotes','Вексельная система','royalcontracts','treasury',1.05,37],['customsservice','Таможенный надзор','banknotes','treasury',1.07,43],['creditreform','Долгосрочный королевский кредит','banknotes','shipCost',.96,52],['navalbudget','Смета Адмиралтейства','creditreform','shipCost',.95,58],['centralbooks','Централизованная отчётность','customsservice','treasury',1.07,60],['tradeinsurance','Морское страхование','customsservice','treasury',1.06,60],['civilservice','Служба государственных чиновников','centralbooks','research',1.05,69]],
'Баллистика и боеприпасы':[
['gun8','8-фунтовые корабельные орудия',null,'gunAccuracy',1.02,24],['measuredcharges','Дозированные пороховые заряды',null,'gunAccuracy',1.08,32],['newshot','Стандартизованные ядра','measuredcharges','gunDamage',1.10,39],['powderproof','Испытания пороха','measuredcharges','gunDamage',1.06,50],['guncrewschool','Школа артиллерийских расчётов','measuredcharges','gunReload',1.10,42],['guncarriage','Улучшенный корабельный лафет','guncrewschool','gunReload',1.08,55],['telescopeaim','Прицельные наблюдения','guncrewschool','gunAccuracy',1.06,64],['explosivefuse','Совершенствование запалов','powderproof','gunDamage',1.07,71]],
'Штабы и тактика':[
['staffmaps','Штабные карты',null,'armySpeed',1.07,30],['operationalstaff','Полевой штаб','staffmaps','infantryDef',1.05,36],['supplycommission','Комиссариат снабжения','operationalstaff','armyLoss',.94,40],['divisionalorders','Дивизионные приказы','operationalstaff','infantryAtk',1.06,49],['couriers','Штабные курьеры','staffmaps','armySpeed',1.08,50],['artillerystaff','Офицеры артиллерии','divisionalorders','gunAccuracy',1.05,58],['jointops','Совместные действия флота и армии','artillerystaff','shipPower',1.07,67],['warcollege','Высшая военная школа','divisionalorders','research',1.07,76]]
};
const V6_TECH_BONUSES={};
for(let [cat,arr] of Object.entries(V6_SCHOOLS)){for(let [id,name,req,k,mod,education] of arr){let t={id,name,cat,cost:55+Math.round(education*1.5),time:2.5+education/35,req:req?[req]:[],eduMin:education,desc:`${BONUS_NAMES[k]||({'gunCost':'Стоимость пушек','arsenalSpeed':'Скорость выпуска вооружения','shipHull':'Прочность корпусов','shipSpeed':'Скорость кораблей','gunAccuracy':'Точность артиллерии','infantryAtk':'Атака пехоты','infantryDef':'Оборона пехоты','armySpeed':'Скорость маршей','armyLoss':'Потери полков','regimentTime':'Обучение полков','arsenalCost':'Цена оружейного производства','treasury':'Налоговые доходы','gunDamage':'Урон артиллерии','gunReload':'Скорость перезарядки','shipPower':'Боевая сила кораблей'})[k]||k}: ${mod<1?'−':'+'}${Math.round(Math.abs(mod-1)*100)}%.`,icon:'',art:V6_ICON_CAT[cat]};if(!TECH.some(x=>x.id===id))TECH.push(t);V6_TECH_BONUSES[id]={[k]:mod}}}
const v6OldGlobalMod=globalMod;
globalMod=function(f,k){let v=v6OldGlobalMod(f,k);for(let id of s?.tech?.[f]||[]){let bonus=V6_TECH_BONUSES[id];if(bonus?.[k]!==undefined)v*=bonus[k]}return v};
const v6oldFresh=fresh;
fresh=function(f=0){v6oldFresh(f);v6state();v6atlas(true);tab='industry';drawAll()};
const v6oldRestore=restoreSave;
restoreSave=function(data){let cloned=data.v===6?{...data,v:5}:data;v6oldRestore(cloned);v6state();drawAll()};
save=function(){try{v6state();localStorage.setItem('empire_of_sails_v6_save',JSON.stringify(s));say('Кампания VI сохранена')}catch(e){say('Локальное сохранение недоступно: используйте экспорт JSON')}};
load=function(){try{let raw=JSON.parse(localStorage.getItem('empire_of_sails_v6_save')||localStorage.getItem('empire_of_sails_v5_save')||'null');if(!raw)throw Error('Сохранение не найдено');restoreSave(raw);say('Кампания загружена')}catch(e){showModal(`<h2>Ошибка загрузки</h2><p>${v6name(e.message)}</p>`)}};
zoomMap=function(k,x=800,y=540){let nz=clamp(zoom*k,1,160);if(nz===zoom)return;panX=x-(x-panX)*(nz/zoom);panY=y-(y-panY)*(nz/zoom);zoom=nz;clampPan();updateTransform();v6scaleLabel()};
const v6oldReset=resetMap;
resetMap=function(){v6oldReset();v6scaleLabel()};
const V6_HULLS={
 sloop:{label:'Военный шлюп',art:'ship',max:16,crew:125,speed:13.4,hp:95,tonnage:240,decks:[{name:'Главная палуба',max:12,maxLb:9},{name:'Бак и квартердек',max:4,maxLb:6}],req:null,baseGold:90,wood:44,iron:20,days:90},
 frigate:{label:'44-пушечный фрегат',art:'ship',max:44,crew:410,speed:11.6,hp:230,tonnage:880,decks:[{name:'Главная батарея',max:24,maxLb:18},{name:'Верхняя батарея',max:16,maxLb:12},{name:'Квартердек и бак',max:4,maxLb:9}],req:'frigatedesign',baseGold:270,wood:120,iron:54,days:170},
 line:{label:'74-пушечный линейный корабль',art:'ship',max:74,crew:660,speed:10.2,hp:390,tonnage:1680,decks:[{name:'Нижняя батарея',max:28,maxLb:32},{name:'Верхняя батарея',max:28,maxLb:18},{name:'Квартердек и бак',max:18,maxLb:12}],req:'linebattle',baseGold:550,wood:240,iron:125,days:300}
};
const V6_ADMIRALS=[
 {name:'Сэр Томас Грей',mod:{shipPower:1.08,shipSpeed:1.04}},
 {name:'Жан де Ла Тур',mod:{gunReload:1.10,shipPower:1.03}},
 {name:'Фредерик ван дер Меер',mod:{shipCost:.96,shipSpeed:1.07}},
 {name:'Мигель де Сильва',mod:{gunAccuracy:1.08,shipHull:1.05}},
 {name:'Карл фон Розен',mod:{shipPower:1.11,shipSpeed:.97}},
 {name:'Иван Андреевич Волков',mod:{shipHull:1.10,gunReload:1.04}}
];
let v6FleetPage='squadrons',v6CurrentShip=null,v6CurrentDesign=null;
const v6oldAdvanceProduction=advanceProduction;
advanceProduction=function(){let custom=s.production.filter(q=>q.key==='customship');s.production=s.production.filter(q=>q.key!=='customship');v6oldAdvanceProduction();for(let q of custom){q.remaining--;if(q.remaining<=0){v6completeShip(q)}else{s.production.push(q)}}v6advanceEquipment();v6advanceFleetMoves()};
const v6OldRecruit=recruit;
recruit=function(k){if(['sloop','frigate','line'].includes(k))return say('Корабли VI строятся только по проекту: вкладка Флот → Конструктор');let u=REGIMENTS[k];if(!u)return v6OldRecruit(k);let isInf=u.type==='Пехота',isArt=u.type==='Артиллерия',required=isInf?Math.round(k==='militia'?450:800):isArt?2:0,item=isInf?'musket':isArt?'gun4':null;if(item&&(s.equipment[s.player][item]||0)<required)return say(`На складе недостаточно ${V6_EQUIP[item].name}: требуется ${required} шт. Откройте «Производство».`);
 let before=s.production.length;v6OldRecruit(k);if(s.production.length>before){let q=s.production[s.production.length-1];if(item){s.equipment[s.player][item]-=required;q.supplied={item,required}}q.remaining=Math.max(4,Math.ceil(q.remaining*globalMod(s.player,'regimentTime')))}drawAll()};
const v6advanceWithRegiments=advanceProduction;
advanceProduction=function(){let ready=s.production.filter(q=>q.key!=='customship'&&REGIMENTS[q.key]&&q.remaining===1).map(q=>({...q}));v6advanceWithRegiments();for(let q of ready){let p=s.provinces[q.province];if(p?.owner!==q.f)continue;p.regimentRecords=p.regimentRecords||[];p.regimentRecords.push({id:++s.v6seq,key:q.key,name:`${REGIMENTS[q.key].label} №${(s.v6seq%999)+1}`,strength:800,morale:REGIMENTS[q.key].morale,experience:0,equipment:q.supplied||null})}};
const v6OldTabCourt=tabCourt;
tabCourt=function(){let str=v6OldTabCourt();str=str.replace('<div class="royal-seal">♛</div>',`<div class="v6-portrait" style="background-image:url('${V6_ART.advisor}')"></div>`);str+=`<div class="v6-section"><h3>Числовые модификаторы государства</h3></div>`;for(let k of ['research','shipCost','shipTime','shipPower','armyCost','infantryAtk'])str+=v6percent(s.player,k);return str};
const v6OldTabEconomy=tabEconomy;
tabEconomy=function(){return `<div class="v6-panel">${v6art('industry','large')}<b>Казначейство, торговля и мануфактуры</b><p class="mini">Провинциальные доходы и сырьё финансируют исследования, строительство и военные линии.</p></div>`+v6OldTabEconomy()+`<div class="v6-section"><h3>Военное производство</h3></div><button class="main wide" onclick="tab='industry';tabPanel()">Перейти в арсеналы и на склады</button>`};
showTechTree=v6techTree;
const v6OldTabTech=tabTech;
tabTech=function(){let active=s.research[s.player],t=TECH.find(z=>z.id===active?.id);return `<h2 class="v6-title">Военная наука и промышленность</h2>${v6art(t?v6img(t):'academy','large')}<div class="v6-line"><div class="kv"><span>Исследовано технологий</span><b>${s.tech[s.player].length} / ${TECH.length}</b></div><div class="kv"><span>Образование</span><b>${edu(s.player).toFixed(1)}/100</b></div><div class="kv"><span>Текущий проект</span><b>${t?v6name(t.name):'Нет'}</b></div>${t?`<div class="v6-progress"><i style="width:${Math.round((1-active.remaining/active.total)*100)}%"></i></div><p class="v6-small">Осталось ${active.remaining} дней.</p>`:''}</div><button class="main wide" onclick="showTechTree()">Открыть большое дерево исследований</button>${v6percent(s.player,'research')}`};
const v6OldTabPanel=tabPanel;
tabPanel=function(){if(tab==='industry'){$('tabcontent').innerHTML=v6industry();return}if(tab==='army'){$('tabcontent').innerHTML=v6armyTab();return}if(tab==='fleet'){$('tabcontent').innerHTML=v6fleetTab();return}v6OldTabPanel()};
const v6OldLandResolve=resolveLandOrder;
resolveLandOrder=function(o){let p=s.provinces[o.to];if(!p||p.owner===o.f||!withWar(o.f,p.owner))return v6OldLandResolve(o);if(o.f!==s.player&&p.owner!==s.player)return v6OldLandResolve(o);s.tactical={kind:'land',attacker:o.f,defender:p.owner,from:o.from,to:o.to,force:o.force,turn:1,action:'fire',selected:null,units:null};pauseGame();v6battleDecision()};
const v6OldScaleLabel=v6scaleLabel;
v6scaleLabel=function(){v6OldScaleLabel();let root=$('world');if(!root)return;
 for(let node of root.querySelectorAll('.majorlabel')){node.style.fontSize=(Math.max(10,Math.min(20,15/zoom)))+'px';node.style.strokeWidth=(3/zoom)+'px'}
 for(let node of root.querySelectorAll('.sea-label')){node.style.fontSize=(15/zoom)+'px';node.style.strokeWidth=(2/zoom)+'px'}
 for(let node of root.querySelectorAll('.armytag')){let baseX=+node.dataset.centerx,baseY=+node.dataset.centery;if(!node.dataset.centerx){baseX=+node.getAttribute('x')+13;baseY=+node.getAttribute('y')+1;node.dataset.centerx=baseX;node.dataset.centery=baseY}node.setAttribute('x',baseX-13/zoom);node.setAttribute('y',baseY-1/zoom);node.setAttribute('width',26/zoom);node.setAttribute('height',19/zoom);node.setAttribute('rx',4/zoom)}
 for(let node of root.querySelectorAll('.armytext')){if(!node.dataset.basey)node.dataset.basey=node.getAttribute('y');let orig=+node.dataset.basey;node.setAttribute('y',orig-12+12/zoom);node.style.fontSize=(13/zoom)+'px';node.style.strokeWidth=(2/zoom)+'px'}
};
const v6OldDrawMap=drawMap;
drawMap=function(){v6OldDrawMap();v6scaleLabel()};
const v6OldTravelDays=travelDays;
travelDays=function(a,b,force,f){return Math.max(1,Math.ceil(v6OldTravelDays(a,b,force,f)/globalMod(f,'armySpeed')))};
const v6OldMonthly=monthlyUpdate;
monthlyUpdate=function(){let before=s.gold.slice();v6OldMonthly();for(let f=0;f<F.length;f++){let gained=s.gold[f]-before[f];if(gained>0){let extra=Math.round(gained*(globalMod(f,'treasury')-1));s.gold[f]+=extra}}};
const v6OldPower=power;
power=function(force,f,attacking,loc){let base=v6OldPower(force,f,attacking,loc),rec=force.regimentRecords||[];let weighted=rec.filter(x=>REGIMENTS[x.key]?.type==='Артиллерия').reduce((a,r)=>a+Math.max(0,(r.gunBonus||1)-1),0);return base*(1+Math.min(.45,weighted*.035))};
const V7_ART={"gun4": "assets/images/image.2e5cf6f2af13a85d.jpg", "gun6": "assets/images/image.e3d053365206c0ac.jpg", "gun8": "assets/images/image.32e5d65142b3a043.jpg", "gun9": "assets/images/image.b62802577026689c.jpg", "gun12": "assets/images/image.112a9a9a6d3537ff.jpg", "gun18": "assets/images/image.6d962b220e5827a3.jpg", "gun24": "assets/images/image.0229713abe4fe8b9.jpg", "gun32": "assets/images/image.1253fc8cc663df63.jpg", "gun42": "assets/images/image.200ace9515f189d7.jpg", "matchlock": "assets/images/image.48f853bdbf2b5a68.jpg", "flintlock": "assets/images/image.c55ee3dc59f38163.jpg", "brown_bess": "assets/images/image.fbfb724b8404a25c.jpg", "charleville": "assets/images/image.14c1298cd40ec94b.jpg", "jaeger": "assets/images/image.019e18fa3c38a419.jpg", "carbine": "assets/images/image.209102512afc96b0.jpg", "rifle": "assets/images/image.64e7cc151f7cc789.jpg", "frigate": "assets/images/image.ab1e884d1bfed69b.jpg", "line": "assets/images/image.110851596217ee91.jpg", "sloop": "assets/images/image.a7b6c8b0412efab4.jpg"};

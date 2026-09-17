import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext.jsx';

export default function LegalModal({ type, onClose }) {
  const { t, lang } = useApp();

  const content = {
    privacy: {
      title: t.privacy_policy,
      ar: `
        <h3 class="text-lg font-bold mb-2">سياسة الخصوصية</h3>
        <p class="mb-3">نحن في ستوك جملة نحترم خصوصيتكم ونلتزم بحماية بياناتكم الشخصية.</p>
        <h4 class="font-semibold mb-1">البيانات التي نجمعها</h4>
        <ul class="list-disc list-inside mb-3 text-sm space-y-1">
          <li>الاسم والبريد الإلكتروني ورقم الهاتف عند التسجيل.</li>
          <li>معلومات المتجر والمنتجات والطلبيات التي تقوم بإدخالها.</li>
          <li>معلومات الدفع (إشعارات التحويل البنكي) تُخزَن محلياً في هذه النسخة التجريبية.</li>
        </ul>
        <h4 class="font-semibold mb-1">كيف نستخدم بياناتكم</h4>
        <ul class="list-disc list-inside mb-3 text-sm space-y-1">
          <li>لتقديم الخدمة وتشغيل المنصة.</li>
          <li>لإرسال إشعارات الطلبيات عبر واتساب.</li>
          <li>لتحسين جودة الخدمة والتواصل معكم.</li>
        </ul>
        <h4 class="font-semibold mb-1">مشاركة البيانات</h4>
        <p class="text-sm mb-3">لا نشارك بياناتكم مع أي طرف ثالث دون موافقتكم، إلا بما يقتضيه القانون المغربي.</p>
        <h4 class="font-semibold mb-1">حقوقكم</h4>
        <p class="text-sm">يمكنكم طلب حذف حسابكم وبياناتكم في أي وقت عبر التواصل مع الدعم.</p>
      `,
      fr: `
        <h3 class="text-lg font-bold mb-2">Politique de confidentialité</h3>
        <p class="mb-3">Chez StockJomla, nous respectons votre vie privée et nous engageons à protéger vos données personnelles.</p>
        <h4 class="font-semibold mb-1">Données collectées</h4>
        <ul class="list-disc list-inside mb-3 text-sm space-y-1">
          <li>Nom, e-mail et numéro de téléphone lors de l'inscription.</li>
          <li>Informations sur la boutique, les produits et les commandes saisies.</li>
          <li>Informations de paiement (reçus de virement) stockées localement dans cette démo.</li>
        </ul>
        <h4 class="font-semibold mb-1">Utilisation des données</h4>
        <ul class="list-disc list-inside mb-3 text-sm space-y-1">
          <li>Fournir et exploiter la plateforme.</li>
          <li>Envoyer les notifications de commandes via WhatsApp.</li>
          <li>Améliorer le service et vous contacter.</li>
        </ul>
        <h4 class="font-semibold mb-1">Partage des données</h4>
        <p class="text-sm mb-3">Aucune donnée n'est partagée avec des tiers sans votre consentement, sauf obligation légale marocaine.</p>
        <h4 class="font-semibold mb-1">Vos droits</h4>
        <p class="text-sm">Vous pouvez demander la suppression de votre compte et de vos données à tout moment.</p>
      `,
    },
    terms: {
      title: t.terms_of_service,
      ar: `
        <h3 class="text-lg font-bold mb-2">شروط الاستخدام</h3>
        <p class="mb-3">باستخدامك لمنصة ستوك جملة فإنك توافق على الشروط التالية:</p>
        <ol class="list-decimal list-inside mb-3 text-sm space-y-2">
          <li><b>القبول بالشروط:</b> يجب قراءة هذه الشروط بعناية قبل استخدام المنصة.</li>
          <li><b>طبيعة الخدمة:</b> توفر المنصة أدوات لإدارة المنتجات والطلبيات والفواتير لفائدة الموردين وتجار الجملة في المغرب.</li>
          <li><b>المسؤولية:</b> المستخدم مسؤول عن صحة البيانات التي يدخلها وعن المعاملات التي تتم مع زبائنه.</li>
          <li><b>الاشتراكات:</b> تبدأ الخدمة بتجربة مجانية لمدة 7 أيام، ثم تتطلب اشتراكاً شهرياً حسب الباقة المختارة.</li>
          <li><b>الدفع:</b> يتم الدفع عبر تحويل بنكي إلى أحد حساباتنا (CIH أو التجاري وفا بنك) ومراجعة الإشعار من طرف الإدارة.</li>
          <li><b>الاستخدام المحظور:</b> يمنع استخدام المنصة في أي نشاط مخالف للقانون المغربي.</li>
          <li><b>التعديلات:</b> يحق للمنصة تعديل هذه الشروط مع إشعار المستخدمين مسبقاً.</li>
        </ol>
        <p class="text-sm text-slate-500">آخر تحديث: شتنبر 2026.</p>
      `,
      fr: `
        <h3 class="text-lg font-bold mb-2">Conditions d'utilisation</h3>
        <p class="mb-3">En utilisant la plateforme StockJomla, vous acceptez les conditions suivantes :</p>
        <ol class="list-decimal list-inside mb-3 text-sm space-y-2">
          <li><b>Acceptation:</b> Vous devez lire attentivement ces conditions avant d'utiliser la plateforme.</li>
          <li><b>Nature du service:</b> La plateforme fournit des outils de gestion de produits, commandes et factures aux fournisseurs et grossistes au Maroc.</li>
          <li><b>Responsabilité:</b> L'utilisateur est responsable de l'exactitude des données et des transactions avec ses clients.</li>
          <li><b>Abonnements:</b> Le service démarre par un essai gratuit de 7 jours, puis nécessite un abonnement mensuel selon le forfait choisi.</li>
          <li><b>Paiement:</b> Le paiement s'effectue par virement bancaire vers l'un de nos comptes (CIH ou Attijariwafa Bank), avec validation du reçu par l'administration.</li>
          <li><b>Usages interdits:</b> Toute utilisation contraire à la loi marocaine est interdite.</li>
          <li><b>Modifications:</b> La plateforme se réserve le droit de modifier ces conditions avec préavis.</li>
        </ol>
        <p class="text-sm text-slate-500">Dernière mise à jour : septembre 2026.</p>
      `,
    }
  };

  const c = content[type];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="card max-w-2xl w-full max-h-[85vh] overflow-auto p-6 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 end-4 btn-ghost !p-2">
          <X size={18} />
        </button>
        <div dir={lang === 'ar' ? 'rtl' : 'ltr'} dangerouslySetInnerHTML={{ __html: lang === 'ar' ? c.ar : c.fr }} />
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn-primary">{t.close}</button>
        </div>
      </div>
    </div>
  );
}

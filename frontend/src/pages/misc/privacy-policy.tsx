import { PageLayout } from "../../components/Layout/PageLayout"
import { NextPageCustomProps } from "../_app"

/**
 * Legal page, contains privacy policy with cookies.
 */
const PrivacyPolicy: NextPageCustomProps = () => {
    return <>
        <p className="mb-4 md:mb-6">We are World Wide Weights (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We&apos;re committed to protecting and respecting your privacy. If you have questions about your personal information please contact us.</p>

        <h4 className="text-lg md:text-xl font-semibold md:mb-2">What information we hold about you</h4>
        <p className="mb-4 md:mb-6">We may collect non-personally identifiable information about you in the course of your interaction with our site. This information may include technical information about the browser or type of device you&apos;re using. This information will be used purely for the purposes of analytics and tracking the number of visitors to our site.</p>

        <h4 className="text-lg md:text-xl font-semibold md:mb-2">Keeping your data secure</h4>
        <p className="mb-4 md:mb-6">We are committed to ensuring that any information you provide to us is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable measures and procedures to safeguard and secure the information that we collect.</p>

        <h4 className="text-lg md:text-xl font-semibold md:mb-2">Cookie policy</h4>
        <p className="mb-4 md:mb-6">Cookies are small files that a site or its service provider transfers to your computer&apos;s hard drive through your Web browser (if you allow) that enable the site&apos;s or service provider&apos;s systems to recognize your browser and capture and remember certain information. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>
        <p className="mb-2 md:mb-4">We use cookies to:</p>

        <ul className="list-disc ml-10 mb-4 md:mb-6">
            <li className="mb-2 md:mb-3">Understand and save user&apos;s preferences for future visits.</li>
            <li className="mb-2 md:mb-3">Keep track of advertisements.</li>
            <li>Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future. We may also use trusted third-party services that track this information on our behalf.</li>
        </ul>
        <p className="mb-4 md:mb-6">If you disable cookies, some features may be disabled but it mustn&apos;t affect your user experience in any material way.</p>

        <h4 className="text-lg md:text-xl font-semibold md:mb-2">Third-party links</h4>
        <p className="mb-4 md:mb-6">Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.</p>

        <h4 className="text-lg md:text-xl font-semibold md:mb-2">Third-party cookies</h4>
        <p className="mb-4 md:mb-6">We use cookies from the following third parties:</p>
        <ul className="list-disc ml-10 mb-4 md:mb-6">
            <li className="mb-2 md:mb-3">
                <h6 className="font-semibold">Google Analytics</h6>
                <p>We use <a className="text-blue-500 hover:text-blue-700" href="https://marketingplatform.google.com/about/analytics/" target="_blank" rel="noopener noreferrer">Google Analytics</a> to collect statistical information regarding how the website is used. This information is not personally identifiable.</p>
            </li>
            <li className="mb-2 md:mb-3">
                <h6 className="font-semibold">Google Adsense</h6>
                <p>We use <a className="text-blue-500 hover:text-blue-700" href="https://www.google.com/adsense/" target="_blank" rel="noopener noreferrer">Google AdSense</a> to display ads on some of our pages. Google AdSense may use user data. You can review Google&apos;s privacy policy regarding advertising <a className="text-blue-500 hover:text-blue-700" href="https://www.google.com/policies/privacy/ads/" target="_blank" rel="noopener noreferrer">here</a>. That page also provides information on how to manage what information is collected and how to opt out of collection.</p>
            </li>
            <li className="mb-2 md:mb-3">
                <h6 className="font-semibold">Google Tag Manager</h6>
                <p>We use <a className="text-blue-500 hover:text-blue-700" href="https://support.google.com/tagmanager/answer/6102821" target="_blank" rel="noopener noreferrer">Google Tag Manager</a> to manage google services. Google Tag Manager may use user data.</p>
            </li>
            <li className="mb-2 md:mb-3">
                <h6 className="font-semibold">Google Fonts</h6>
                <p>We use <a className="text-blue-500 hover:text-blue-700" href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer">Google Fonts</a> to have a customized font. Google Fonts may use user data. You can review Google&apos;s privacy policy <a className="text-blue-500 hover:text-blue-700" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">here</a>. That page also provides information on how to manage what information is collected and how to opt out of collection.</p>
            </li>
            <li className="mb-2 md:mb-3">
                <h6 className="font-semibold">Material Symbols</h6>
                <p>We use <a className="text-blue-500 hover:text-blue-700" href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer">Material Symbols</a> to use icons. Material Symbols may use user data. You can review Google&apos;s privacy policy <a className="text-blue-500 hover:text-blue-700" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">here</a>. That page also provides information on how to manage what information is collected and how to opt out of collection.</p>
            </li>
        </ul>

        <h4 className="text-lg md:text-xl font-semibold md:mb-2">How to disable cookies</h4>
        <p className="mb-4 md:mb-6">Most modern browsers allow you to control your cookie settings for all websites that you browse. You can disable cookie deployment completely by editing your browser settings, however in doing this you may be limiting the functionality that is displayed on our website. To learn how to disable cookies on your preferred browser we recommend reading this <a className="text-blue-500 hover:text-blue-700" href="https://support.google.com/accounts/bin/answer.py?hl=en&amp;answer=61416" target="_blank" rel="noopener noreferrer">advice posted by Google.</a></p>
        <p className="mb-4 md:mb-6">You can also disable Google Analytics on all websites by downloading the <a className="text-blue-500 hover:text-blue-700" href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on.</a></p>

        <h4 className="text-lg md:text-xl font-semibold md:mb-2">Rights</h4>
        <p className="mb-4 md:mb-6">You have a right to access the personal data we hold about you or obtain a copy of it. To do so please contact us. If you believe that the information we hold for you is incomplete or inaccurate, you may contact us to ask us to complete or correct that information. You also have the right to request the erasure of your personal data. Please contact us if you would like us to remove your personal data.</p>

        <h4 className="text-lg md:text-xl font-semibold md:mb-2">Acceptance of this policy</h4>
        <p className="mb-4 md:mb-6">Continued use of our site signifies your acceptance of this policy. If you do not accept the policy then please do not use this site. When registering we will further request your explicit acceptance of the privacy policy.</p>

        <h4 className="text-lg md:text-xl font-semibold md:mb-2">Changes to this policy</h4>
        <p className="mb-4 md:mb-6">We may make changes to this policy at any time. You may be asked to review and re-accept the information in this policy if it changes in the future.</p>
    </>
}

PrivacyPolicy.getLayout = (page) => {
    return <PageLayout title="Privacy Policy">
        {page}
    </PageLayout>
}

export default PrivacyPolicy

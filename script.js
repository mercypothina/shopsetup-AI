document.querySelector('button').addEventListener('click', async function () {
    const description = document.querySelector('textarea').value;
    const language = document.querySelector('select').value;
    const category = document.getElementById('category').value;

    if (!description) {
        alert('Please tell me about your business!');
        return;
    }

    document.getElementById('loader').style.display = 'block';
    document.querySelector('button').disabled = true;
    document.querySelector('button').innerText = 'Generating...';

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + GROQ_API_KEY
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                max_tokens: 4000,
                messages: [{
                    role: 'user',
                    content: `You are a business content generator for Indian shops.
Business: "${description}"
Category: ${category}
Language: ${language}

Generate exactly these 7 sections with COMPLETE content. Use these exact headings:

SECTION1_START
Write Google Business Profile description here (minimum 150 words)
SECTION1_END

SECTION2_START
Write Instagram Bio here with emojis, location, timings, contact, hashtags
SECTION2_END

SECTION3_START
Write exactly 10 Instagram Post Captions numbered 1 to 10
SECTION3_END

SECTION4_START
Write complete WhatsApp Business greeting message here
SECTION4_END

SECTION5_START
SHOP_NAME: (write shop name)
TAGLINE: (write tagline)
ADDRESS: (write address)
PHONE: (write phone)
EMAIL: (write email)
WEBSITE: (write website)
SECTION5_END

SECTION6_START
Write festive messages for Diwali, Ugadi, Holi, Navratri, Christmas
SECTION6_END

SECTION7_START
Write complete one page website content with hero, about, services, contact
SECTION7_END`
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            alert('Error: ' + data.error.message);
            return;
        }

        const aiResponse = data.choices[0].message.content;

        // Extract each section
        function extract(text, num) {
            const regex = new RegExp(`SECTION${num}_START([\\s\\S]*?)SECTION${num}_END`);
            return text.match(regex)?.[1]?.trim() || '';
        }

        document.querySelector('#s1 p').innerText = extract(aiResponse, 1);
        document.querySelector('#s1').classList.add('filled');

        // Small delay between each card appearing
        setTimeout(() => {
            document.querySelector('#s2 p').innerText = extract(aiResponse, 2);
            document.querySelector('#s2').classList.add('filled');
        }, 300);

        setTimeout(() => {
            document.querySelector('#s3 p').innerText = extract(aiResponse, 3);
            document.querySelector('#s3').classList.add('filled');
        }, 600);

        setTimeout(() => {
            document.querySelector('#s4 p').innerText = extract(aiResponse, 4);
            document.querySelector('#s4').classList.add('filled');
        }, 900);

        setTimeout(() => {
            document.querySelector('#s5').classList.add('filled');
        }, 1200);

        setTimeout(() => {
            document.querySelector('#s6 p').innerText = extract(aiResponse, 6);
            document.querySelector('#s6').classList.add('filled');
        }, 1500);

        setTimeout(() => {
            document.querySelector('#s7 p').innerText = extract(aiResponse, 7);
            document.querySelector('#s7').classList.add('filled');
        }, 1800);

        // Visiting card
        const cardSection = extract(aiResponse, 5);
        const getField = (field) => cardSection.match(new RegExp(field + ':\\s*(.+)'))?.[1]?.trim() || '';

        document.getElementById('card-name').innerText = getField('SHOP_NAME') || description.split(' ').slice(0,3).join(' ');
        document.getElementById('card-tagline').innerText = getField('TAGLINE') || 'Your trusted local shop';
        document.getElementById('card-address').innerText = '📍 ' + (getField('ADDRESS') || 'Your Address');
        document.getElementById('card-phone').innerText = '📞 ' + (getField('PHONE') || 'Phone Number');
        document.getElementById('card-email').innerText = '📧 ' + (getField('EMAIL') || 'Email');
        document.getElementById('card-website').innerText = '🌐 ' + (getField('WEBSITE') || 'Website');

    } catch (err) {
        alert('Something went wrong! Try again.');
        console.log(err);
    } finally {
        document.getElementById('loader').style.display = 'none';
        document.querySelector('button').disabled = false;
        document.querySelector('button').innerText = 'Submit';
    }
});

function downloadCard() {
    const card = document.getElementById('visiting-card');
    html2canvas(card, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#4a0080',
        logging: false,
        onclone: function(clonedDoc) {
            clonedDoc.getElementById('visiting-card').style.transform = 'none';
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'visiting-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

function copyText(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text);
    alert('Copied!');
}

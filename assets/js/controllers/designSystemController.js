import authService from '../services/authService.js';
import { renderAppHeader } from '../views/appHeader.js';

export default async function designSystemController() {
    const app = document.getElementById('app');
    const user = authService.getCurrentUser();

    const topNav = user
        ? renderAppHeader(user, window.location.pathname)
        : `
        <nav class="bg-white shadow-md">
            <div class="container mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <a href="/" data-link class="flex items-center space-x-2 hover:opacity-90">
                        <span class="text-2xl font-bold text-brand-primary">Avy</span>
                        <span class="text-sm text-gray-500">by Avenga Academy</span>
                    </a>
                    <div class="space-x-4">
                        <a href="/login" data-link class="text-gray-600 hover-text-brand transition">Login</a>
                        <a href="/" data-link class="btn btn-secondary">Back to Landing</a>
                    </div>
                </div>
            </div>
        </nav>
    `;

    app.innerHTML = `
        ${topNav}
        <div class="bg-gray-50 min-h-screen py-8">
            <div class="container mx-auto px-4">
                <div class="fade-in space-y-8">
                    <section class="card no-hover">
                        <h1 class="text-4xl font-bold text-gray-800 mb-2">Avy UI Kitchen Sink</h1>
                        <p class="text-gray-600 mb-4">
                            Canonical visual standard for Bloom, Evergreen, and Meridian.
                        </p>
                        <div class="p-4 rounded-lg bg-orange-50 border border-orange-200">
                            <p class="text-sm text-orange-900">
                                Base inspiration: Avenga Academy + Avenga brand direction, implemented with current project styles.
                            </p>
                        </div>
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Color Tokens</h2>
                        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            ${renderColorSwatch('--color-primary', '#dd2c00')}
                            ${renderColorSwatch('--color-primary-dark', '#b02400')}
                            ${renderColorSwatch('--color-secondary', '#0257b4')}
                            ${renderColorSwatch('--color-accent', '#ffa500')}
                            ${renderColorSwatch('--color-success', '#48bb78')}
                            ${renderColorSwatch('--color-danger', '#dd2c00')}
                            ${renderColorSwatch('--color-text', '#2d3748')}
                            ${renderColorSwatch('--color-bg', '#f7fafc')}
                        </div>
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Typography</h2>
                        <div class="grid md:grid-cols-2 gap-4">
                            ${renderCodeExample('Heading 1 / Hero', '<p class="text-5xl font-bold text-gray-800">Heading 1 / Hero</p>', '<p class="text-5xl font-bold text-gray-800">Heading 1 / Hero</p>')}
                            ${renderCodeExample('Heading 2 / Page Title', '<p class="text-4xl font-bold text-gray-800">Heading 2 / Page Title</p>', '<p class="text-4xl font-bold text-gray-800">Heading 2 / Page Title</p>')}
                            ${renderCodeExample('Heading 3 / Section Title', '<p class="text-2xl font-bold text-gray-800">Heading 3 / Section Title</p>', '<p class="text-2xl font-bold text-gray-800">Heading 3 / Section Title</p>')}
                            ${renderCodeExample('Heading 4 / Card Title', '<p class="text-lg font-semibold text-gray-700">Heading 4 / Card Title</p>', '<p class="text-lg font-semibold text-gray-700">Heading 4 / Card Title</p>')}
                            ${renderCodeExample('Body Text', '<p class="text-base text-gray-700">Body text / default paragraph with Inter font.</p>', '<p class="text-base text-gray-700">Body text / default paragraph with Inter font.</p>')}
                            ${renderCodeExample('Helper Text', '<p class="text-sm text-gray-500">Helper / metadata text.</p>', '<p class="text-sm text-gray-500">Helper / metadata text.</p>')}
                        </div>
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Spacing Rhythm</h2>
                        <div class="space-y-3">
                            ${renderSpacingRow('4px', 'Tailwind: gap-1 / p-1')}
                            ${renderSpacingRow('8px', 'Tailwind: gap-2 / p-2')}
                            ${renderSpacingRow('12px', 'Tailwind: gap-3 / p-3')}
                            ${renderSpacingRow('16px', 'Tailwind: gap-4 / p-4')}
                            ${renderSpacingRow('24px', 'Tailwind: gap-6 / p-6')}
                            ${renderSpacingRow('32px', 'Tailwind: gap-8 / p-8')}
                        </div>
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Buttons</h2>
                        <div class="grid md:grid-cols-2 gap-4">
                            ${renderCodeExample('Primary Button', '<button class="btn btn-primary">Primary</button>', '<button class="btn btn-primary">Primary</button>')}
                            ${renderCodeExample('Secondary Button', '<button class="btn btn-secondary">Secondary</button>', '<button class="btn btn-secondary">Secondary</button>')}
                            ${renderCodeExample('Shortlist Button', '<button class="btn btn-shortlist">Shortlist</button>', '<button class="btn btn-shortlist">Shortlist</button>')}
                            ${renderCodeExample('Secondary Solid', '<button class="btn bg-brand-secondary text-white hover:opacity-90">Secondary Solid</button>', '<button class="btn bg-brand-secondary text-white hover:opacity-90">Secondary Solid</button>')}
                            ${renderCodeExample('Ghost Button', '<button class="btn bg-white text-brand-primary border-brand-primary border-2">Ghost</button>', '<button class="btn bg-white text-brand-primary border-brand-primary border-2">Ghost</button>')}
                        </div>
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Form Controls</h2>
                        <div class="grid md:grid-cols-3 gap-4 mb-6">
                            ${renderCodeExample('Text Input', '<div><label class="form-label">Text Input</label><input class="form-input" type="text" placeholder="Enter value..." /></div>', '<div>\n  <label class="form-label">Text Input</label>\n  <input class="form-input" type="text" placeholder="Enter value..." />\n</div>')}
                            ${renderCodeExample('Select', '<div><label class="form-label">Select</label><select class="form-input"><option>Option A</option><option>Option B</option></select></div>', '<div>\n  <label class="form-label">Select</label>\n  <select class="form-input">\n    <option>Option A</option>\n    <option>Option B</option>\n  </select>\n</div>')}
                            ${renderCodeExample('Date Input', '<div><label class="form-label">Date</label><input class="form-input" type="date" /></div>', '<div>\n  <label class="form-label">Date</label>\n  <input class="form-input" type="date" />\n</div>')}
                        </div>

                        <div class="grid md:grid-cols-2 gap-6">
                            ${renderCodeExample('Standard Form Layout', `
                            <div class="card no-hover border border-gray-200">
                                <h3 class="text-lg font-semibold text-gray-800 mb-4">Standard Form Layout</h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="form-label">Full Name</label>
                                        <input class="form-input" type="text" placeholder="Jane Doe" />
                                    </div>
                                    <div>
                                        <label class="form-label">Email</label>
                                        <input class="form-input" type="email" placeholder="jane@company.com" />
                                    </div>
                                    <div>
                                        <label class="form-label">Role</label>
                                        <select class="form-input">
                                            <option>Student</option>
                                            <option>Employer</option>
                                            <option>Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label">Notes</label>
                                        <textarea class="form-input" rows="4" placeholder="Write details..."></textarea>
                                    </div>
                                    <div class="flex gap-2">
                                        <button class="btn btn-primary">Save</button>
                                        <button class="btn btn-secondary">Cancel</button>
                                    </div>
                                </div>
                            </div>
                            `, `<div class="card no-hover border border-gray-200">
  <h3 class="text-lg font-semibold text-gray-800 mb-4">Standard Form Layout</h3>
  <div class="space-y-4">
    <div>
      <label class="form-label">Full Name</label>
      <input class="form-input" type="text" placeholder="Jane Doe" />
    </div>
    <div>
      <label class="form-label">Email</label>
      <input class="form-input" type="email" placeholder="jane@company.com" />
    </div>
    <div>
      <label class="form-label">Role</label>
      <select class="form-input">
        <option>Student</option>
        <option>Employer</option>
        <option>Admin</option>
      </select>
    </div>
    <div>
      <label class="form-label">Notes</label>
      <textarea class="form-input" rows="4" placeholder="Write details..."></textarea>
    </div>
    <div class="flex gap-2">
      <button class="btn btn-primary">Save</button>
      <button class="btn btn-secondary">Cancel</button>
    </div>
  </div>
</div>`)}
                            ${renderCodeExample('Validation + Inputs', `
                            <div class="card no-hover border border-gray-200">
                                <h3 class="text-lg font-semibold text-gray-800 mb-4">Validation + Inputs</h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="form-label">Search</label>
                                        <div class="relative">
                                            <input class="form-input pr-9" type="text" placeholder="Search candidates..." />
                                            <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="form-label">Input with helper</label>
                                        <input class="form-input" type="text" value="Example value" />
                                        <p class="text-xs text-gray-500 mt-1">Use helper text under fields when needed.</p>
                                    </div>
                                    <div>
                                        <label class="form-label">Error State</label>
                                        <input class="form-input border-red-400 focus:border-red-500 focus:ring-red-100" type="text" value="Invalid value" />
                                        <p class="text-xs text-red-600 mt-1">Please provide a valid value.</p>
                                    </div>
                                </div>
                            </div>
                            `, `<div class="card no-hover border border-gray-200">
  <h3 class="text-lg font-semibold text-gray-800 mb-4">Validation + Inputs</h3>
  <div class="space-y-4">
    <div>
      <label class="form-label">Search</label>
      <div class="relative">
        <input class="form-input pr-9" type="text" placeholder="Search candidates..." />
        <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
      </div>
    </div>
    <div>
      <label class="form-label">Input with helper</label>
      <input class="form-input" type="text" value="Example value" />
      <p class="text-xs text-gray-500 mt-1">Use helper text under fields when needed.</p>
    </div>
    <div>
      <label class="form-label">Error State</label>
      <input class="form-input border-red-400 focus:border-red-500 focus:ring-red-100" type="text" value="Invalid value" />
      <p class="text-xs text-red-600 mt-1">Please provide a valid value.</p>
    </div>
  </div>
</div>`)}
                        </div>
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Tables</h2>
                        ${renderCodeExample('Data Table', `
                        <div class="overflow-x-auto border border-gray-200 rounded-xl bg-white">
                            <table class="min-w-full text-sm">
                                <thead class="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th class="text-left px-4 py-3 font-semibold">Name</th>
                                        <th class="text-left px-4 py-3 font-semibold">Role</th>
                                        <th class="text-left px-4 py-3 font-semibold">Status</th>
                                        <th class="text-left px-4 py-3 font-semibold">Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${renderTableRow('John Doe', 'Student', 'Active', '2h ago', 'green')}
                                    ${renderTableRow('Alice Johnson', 'Employer', 'Pending', '5h ago', 'yellow')}
                                    ${renderTableRow('Admin User', 'Admin', 'Active', '1d ago', 'green')}
                                    ${renderTableRow('Maria Petrova', 'Admin', 'Suspended', '3d ago', 'red')}
                                </tbody>
                            </table>
                        </div>
                        `, `<div class="overflow-x-auto border border-gray-200 rounded-xl bg-white">
  <table class="min-w-full text-sm">
    <thead class="bg-gray-100 text-gray-700">
      <tr>
        <th class="text-left px-4 py-3 font-semibold">Name</th>
        <th class="text-left px-4 py-3 font-semibold">Role</th>
        <th class="text-left px-4 py-3 font-semibold">Status</th>
        <th class="text-left px-4 py-3 font-semibold">Updated</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-t border-gray-100">
        <td class="px-4 py-3 text-gray-800 font-medium">John Doe</td>
        <td class="px-4 py-3 text-gray-600">Student</td>
        <td class="px-4 py-3"><span class="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span></td>
        <td class="px-4 py-3 text-gray-500">2h ago</td>
      </tr>
    </tbody>
  </table>
</div>`)}
                        <p class="text-xs text-gray-500 mt-3">
                            Table standard: soft header background, 1px row separators, badges for status.
                        </p>
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Images and Media Blocks</h2>
                        <div class="grid md:grid-cols-3 gap-4">
                            ${renderImageCard('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80', 'Hero / Campaign Image', 'Use for top-level marketing sections.')}
                            ${renderImageCard('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', 'Card Cover Image', 'Use in event/resource preview cards.')}
                            ${renderImageCard('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80', 'Dashboard Context Image', 'Optional illustrative support in empty states.')}
                        </div>
                        <div class="mt-4 p-4 rounded-lg border border-gray-200 bg-white">
                            <p class="text-sm text-gray-700">
                                <strong>Media rules:</strong> keep rounded corners, maintain object-cover ratio, avoid heavy filters, keep overlays readable.
                            </p>
                        </div>
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Feedback and Badges</h2>
                        <div class="grid md:grid-cols-2 gap-4">
                            ${renderCodeExample('Success Alert', '<div class="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">Success alert: action completed.</div>', '<div class="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">Success alert: action completed.</div>')}
                            ${renderCodeExample('Info Alert', '<div class="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">Info alert: contextual guidance.</div>', '<div class="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">Info alert: contextual guidance.</div>')}
                            ${renderCodeExample('Warning Alert', '<div class="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">Warning alert: review needed.</div>', '<div class="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800">Warning alert: review needed.</div>')}
                            ${renderCodeExample('Error Alert', '<div class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800">Error alert: something failed.</div>', '<div class="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800">Error alert: something failed.</div>')}
                        </div>
                        ${renderCodeExample('Status Badges', `
                        <div class="flex flex-wrap gap-2 mt-4">
                            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Rejected</span>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Info</span>
                        </div>
                        `, `<div class="flex flex-wrap gap-2 mt-4">
  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>
  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>
  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Rejected</span>
  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Info</span>
</div>`)}
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Cards and States</h2>
                        <div class="grid md:grid-cols-3 gap-4">
                            ${renderCodeExample('Interactive Card', '<div class="card"><h3 class="text-lg font-semibold mb-2">Interactive Card</h3><p class="text-sm text-gray-600">Uses lift on hover.</p></div>', '<div class="card">\n  <h3 class="text-lg font-semibold mb-2">Interactive Card</h3>\n  <p class="text-sm text-gray-600">Uses lift on hover.</p>\n</div>')}
                            ${renderCodeExample('Static Card', '<div class="card no-hover"><h3 class="text-lg font-semibold mb-2">Static Card</h3><p class="text-sm text-gray-600">Use for dense content blocks.</p></div>', '<div class="card no-hover">\n  <h3 class="text-lg font-semibold mb-2">Static Card</h3>\n  <p class="text-sm text-gray-600">Use for dense content blocks.</p>\n</div>')}
                            ${renderCodeExample('Loading Card', '<div class="card no-hover"><div class="spinner"></div><p class="text-sm text-center text-gray-600">Loading state</p></div>', '<div class="card no-hover">\n  <div class="spinner"></div>\n  <p class="text-sm text-center text-gray-600">Loading state</p>\n</div>')}
                        </div>
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Layout Rules</h2>
                        <ul class="space-y-2 text-gray-700">
                            <li><strong>Container:</strong> Keep page content in \`container mx-auto px-4\`.</li>
                            <li><strong>Section rhythm:</strong> Prefer \`py-8\` and \`gap-6/gap-8\` for major blocks.</li>
                            <li><strong>Corners:</strong> Use rounded-lg or rounded-xl consistently.</li>
                            <li><strong>Depth:</strong> Use card shadows; avoid custom random shadow values.</li>
                            <li><strong>Actions:</strong> Primary action = \`btn-primary\`, secondary = \`btn-secondary\`.</li>
                            <li><strong>Color usage:</strong> Keep orange/blue as the dominant brand pair.</li>
                        </ul>
                    </section>

                    <section class="card no-hover">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Clickable Code Examples</h2>
                        <p class="text-sm text-gray-600 mb-4">
                            Use “Show code” to reveal the exact HTML pattern and “Copy code” to reuse it.
                        </p>
                        <div class="grid lg:grid-cols-2 gap-4">
                            ${renderCodeExample(
                                'Primary + Secondary Buttons',
                                `
                                    <div class="flex flex-wrap gap-3">
                                        <button class="btn btn-primary">Save Changes</button>
                                        <button class="btn btn-secondary">Cancel</button>
                                    </div>
                                `,
                                `<div class="flex flex-wrap gap-3">
  <button class="btn btn-primary">Save Changes</button>
  <button class="btn btn-secondary">Cancel</button>
</div>`
                            )}
                            ${renderCodeExample(
                                'Standard Form Block',
                                `
                                    <div class="space-y-4">
                                        <div>
                                            <label class="form-label">Full Name</label>
                                            <input class="form-input" type="text" placeholder="Jane Doe" />
                                        </div>
                                        <div>
                                            <label class="form-label">Email</label>
                                            <input class="form-input" type="email" placeholder="jane@company.com" />
                                        </div>
                                        <button class="btn btn-primary">Submit</button>
                                    </div>
                                `,
                                `<div class="space-y-4">
  <div>
    <label class="form-label">Full Name</label>
    <input class="form-input" type="text" placeholder="Jane Doe" />
  </div>
  <div>
    <label class="form-label">Email</label>
    <input class="form-input" type="email" placeholder="jane@company.com" />
  </div>
  <button class="btn btn-primary">Submit</button>
</div>`
                            )}
                            ${renderCodeExample(
                                'Status Badge',
                                `
                                    <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        Active
                                    </span>
                                `,
                                `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
  Active
</span>`
                            )}
                            ${renderCodeExample(
                                'Card with Image',
                                `
                                    <div class="card no-hover p-0 overflow-hidden max-w-sm">
                                        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" alt="Card Cover" class="w-full h-40 object-cover" />
                                        <div class="p-4">
                                            <h3 class="text-base font-semibold text-gray-800 mb-1">Card Title</h3>
                                            <p class="text-sm text-gray-600">Card caption and supporting text.</p>
                                        </div>
                                    </div>
                                `,
                                `<div class="card no-hover p-0 overflow-hidden max-w-sm">
  <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80" alt="Card Cover" class="w-full h-40 object-cover" />
  <div class="p-4">
    <h3 class="text-base font-semibold text-gray-800 mb-1">Card Title</h3>
    <p class="text-sm text-gray-600">Card caption and supporting text.</p>
  </div>
</div>`
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authService.logout());
    }

    initializeCodeExamples();
}

function renderColorSwatch(token, fallbackHex) {
    const preview = `
        <div class="rounded-lg border border-gray-200 overflow-hidden bg-white">
            <div class="h-16" style="background: var(${token}, ${fallbackHex});"></div>
            <div class="p-3">
                <p class="text-sm font-semibold text-gray-800">${token}</p>
                <p class="text-xs text-gray-500">${fallbackHex}</p>
            </div>
        </div>
    `;
    const snippet = `<div class="rounded-lg border border-gray-200 overflow-hidden bg-white">
  <div class="h-16" style="background: var(${token}, ${fallbackHex});"></div>
  <div class="p-3">
    <p class="text-sm font-semibold text-gray-800">${token}</p>
    <p class="text-xs text-gray-500">${fallbackHex}</p>
  </div>
</div>`;
    return renderCodeExample(token, preview, snippet);
}

function renderTableRow(name, role, status, updated, tone) {
    const toneClasses = {
        green: 'bg-green-100 text-green-700',
        yellow: 'bg-yellow-100 text-yellow-700',
        red: 'bg-red-100 text-red-700',
        blue: 'bg-blue-100 text-blue-700',
    };
    return `
        <tr class="border-t border-gray-100">
            <td class="px-4 py-3 text-gray-800 font-medium">${name}</td>
            <td class="px-4 py-3 text-gray-600">${role}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${toneClasses[tone] || toneClasses.blue}">${status}</span>
            </td>
            <td class="px-4 py-3 text-gray-500">${updated}</td>
        </tr>
    `;
}

function renderImageCard(src, title, caption) {
    const preview = `
        <div class="card no-hover p-0 overflow-hidden">
            <img src="${src}" alt="${title}" class="w-full h-40 object-cover" />
            <div class="p-4">
                <h3 class="text-base font-semibold text-gray-800 mb-1">${title}</h3>
                <p class="text-sm text-gray-600">${caption}</p>
            </div>
        </div>
    `;
    const snippet = `<div class="card no-hover p-0 overflow-hidden">
  <img src="${src}" alt="${title}" class="w-full h-40 object-cover" />
  <div class="p-4">
    <h3 class="text-base font-semibold text-gray-800 mb-1">${title}</h3>
    <p class="text-sm text-gray-600">${caption}</p>
  </div>
</div>`;
    return renderCodeExample(title, preview, snippet);
}

function renderCodeExample(title, previewMarkup, codeSnippet) {
    return `
        <div class="border border-gray-200 rounded-xl bg-white overflow-hidden" data-ds-example>
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
                <h3 class="text-sm font-semibold text-gray-800">${title}</h3>
                <div class="flex gap-2">
                    <button class="ds-toggle-code text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                        Show code
                    </button>
                    <button class="ds-copy-code text-xs px-3 py-1 rounded bg-brand-secondary text-white hover:opacity-90" data-code="${encodeURIComponent(codeSnippet)}">
                        Copy code
                    </button>
                </div>
            </div>
            <div class="p-4">${previewMarkup}</div>
            <div class="ds-code-panel hidden border-t border-gray-100 bg-gray-50 px-4 py-3">
                <pre class="ds-code-content text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto"></pre>
            </div>
        </div>
    `;
}

function initializeCodeExamples() {
    document.querySelectorAll('.ds-toggle-code').forEach((btn) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('[data-ds-example]');
            const panel = card?.querySelector('.ds-code-panel');
            const copyBtn = card?.querySelector('.ds-copy-code');
            const pre = panel?.querySelector('.ds-code-content');
            if (!panel || !copyBtn || !pre) return;

            if (pre.textContent.trim() === '') {
                pre.textContent = decodeURIComponent(copyBtn.dataset.code || '');
            }

            panel.classList.toggle('hidden');
            btn.textContent = panel.classList.contains('hidden') ? 'Show code' : 'Hide code';
        });
    });

    document.querySelectorAll('.ds-copy-code').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const raw = decodeURIComponent(btn.dataset.code || '');
            try {
                await navigator.clipboard.writeText(raw);
                const original = btn.textContent;
                btn.textContent = 'Copied';
                setTimeout(() => {
                    btn.textContent = original;
                }, 1200);
            } catch {
                const original = btn.textContent;
                btn.textContent = 'Copy failed';
                setTimeout(() => {
                    btn.textContent = original;
                }, 1400);
            }
        });
    });
}

function renderSpacingRow(px, usage) {
    const preview = `
        <div class="flex items-center gap-3">
            <div class="bg-brand-secondary rounded" style="width:${px};height:16px;"></div>
            <span class="text-sm font-semibold text-gray-800">${px}</span>
            <span class="text-sm text-gray-500">${usage}</span>
        </div>
    `;
    const snippet = `<div class="flex items-center gap-3">
  <div class="bg-brand-secondary rounded" style="width:${px};height:16px;"></div>
  <span class="text-sm font-semibold text-gray-800">${px}</span>
  <span class="text-sm text-gray-500">${usage}</span>
</div>`;
    return renderCodeExample(px, preview, snippet);
}
